"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadPublicProductImage } from "@/lib/media";

export type ProductFormState = { ok: boolean; message: string };

const ProductSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name").max(180),
  category: z.string().trim().min(2, "Enter a category").max(80),
  age_group: z.string().trim().max(40).optional(),
  budget_tier: z.string().trim().max(40).optional(),
  retailer_url: z.string().url("Enter a valid retailer URL").refine(value => value.startsWith("https://"), "Use an https:// retailer URL"),
  asin: z.string().trim().max(40).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).min(1, "Choose at least one interest category").max(15)
});

export async function createCatalogProduct(_previous: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in again to continue" };

  const { data: appUser } = await supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle();
  if (!appUser?.is_admin) return { ok: false, message: "Admin access is required" };

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    age_group: formData.get("age_group") || undefined,
    budget_tier: formData.get("budget_tier") || undefined,
    retailer_url: formData.get("retailer_url"),
    asin: formData.get("asin") || undefined,
    tags: formData.getAll("tags")
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the product details" };

  const image = formData.get("image");
  if (!(image instanceof File) || !image.size) return { ok: false, message: "Choose a product image" };

  let uploadedPath: string | null = null;
  try {
    const upload = await uploadPublicProductImage(user.id, image);
    uploadedPath = upload.path;
    const admin = createAdminClient();
    const { error } = await admin.from("products").insert({
      asin: parsed.data.asin || `ADMIN-${randomUUID()}`,
      name: parsed.data.name,
      category: parsed.data.category,
      archetype_tags: parsed.data.tags,
      budget_tier: parsed.data.budget_tier || null,
      age_group: parsed.data.age_group || null,
      image_url: upload.publicUrl,
      amazon_url: parsed.data.retailer_url
    });
    if (error) throw new Error(error.message);

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/recommendations");
    return { ok: true, message: `${parsed.data.name} was added to the shop` };
  } catch (error) {
    if (uploadedPath) await createAdminClient().storage.from("product-images").remove([uploadedPath]);
    return { ok: false, message: error instanceof Error ? error.message : "Could not add the product" };
  }
}
