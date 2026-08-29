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

const ProductIdSchema = z.string().uuid("Choose a valid product to edit");

type AdminAuthorization = { ok: true; userId: string } | { ok: false; message: string };

async function getAuthorizedAdmin(): Promise<AdminAuthorization> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in again to continue" };

  const { data: appUser } = await supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle();
  if (!appUser?.is_admin) return { ok: false, message: "Admin access is required" };

  return { ok: true, userId: user.id };
}

function parseProduct(formData: FormData) {
  return ProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    age_group: formData.get("age_group") || undefined,
    budget_tier: formData.get("budget_tier") || undefined,
    retailer_url: formData.get("retailer_url"),
    asin: formData.get("asin") || undefined,
    tags: formData.getAll("tags")
  });
}

function revalidateCatalog() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/recommendations");
}

function productImagePathFromUrl(publicUrl?: string | null) {
  if (!publicUrl) return null;

  try {
    const marker = "/storage/v1/object/public/product-images/";
    const pathname = new URL(publicUrl).pathname;
    const markerIndex = pathname.indexOf(marker);
    return markerIndex === -1 ? null : decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function createCatalogProduct(_previous: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const authorization = await getAuthorizedAdmin();
  if (!authorization.ok) return { ok: false, message: authorization.message };

  const parsed = parseProduct(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the product details" };

  const image = formData.get("image");
  if (!(image instanceof File) || !image.size) return { ok: false, message: "Choose a product image" };

  let uploadedPath: string | null = null;
  try {
    const removeBackground = formData.get("remove_background") === "on";
    const upload = await uploadPublicProductImage(authorization.userId, image, removeBackground);
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

    revalidateCatalog();
    return { ok: true, message: `${parsed.data.name} was added to the shop${removeBackground ? " with a transparent background" : ""}` };
  } catch (error) {
    if (uploadedPath) await createAdminClient().storage.from("product-images").remove([uploadedPath]);
    return { ok: false, message: error instanceof Error ? error.message : "Could not add the product" };
  }
}

export async function updateCatalogProduct(_previous: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const authorization = await getAuthorizedAdmin();
  if (!authorization.ok) return { ok: false, message: authorization.message };

  const productId = ProductIdSchema.safeParse(formData.get("product_id"));
  if (!productId.success) return { ok: false, message: productId.error.issues[0]?.message ?? "Choose a valid product to edit" };

  const parsed = parseProduct(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the product details" };

  const admin = createAdminClient();
  const { data: existing, error: existingError } = await admin
    .from("products")
    .select("id, asin, image_url")
    .eq("id", productId.data)
    .maybeSingle();
  if (existingError) return { ok: false, message: existingError.message };
  if (!existing) return { ok: false, message: "That product no longer exists" };

  const image = formData.get("image");
  const hasReplacementImage = image instanceof File && image.size > 0;
  let uploadedPath: string | null = null;

  try {
    let imageUrl = existing.image_url;
    const removeBackground = formData.get("remove_background") === "on";
    if (hasReplacementImage) {
      const upload = await uploadPublicProductImage(authorization.userId, image, removeBackground);
      uploadedPath = upload.path;
      imageUrl = upload.publicUrl;
    }

    const { data: updated, error } = await admin
      .from("products")
      .update({
        asin: parsed.data.asin || existing.asin,
        name: parsed.data.name,
        category: parsed.data.category,
        archetype_tags: parsed.data.tags,
        budget_tier: parsed.data.budget_tier || null,
        age_group: parsed.data.age_group || null,
        image_url: imageUrl,
        amazon_url: parsed.data.retailer_url
      })
      .eq("id", productId.data)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!updated) throw new Error("That product no longer exists");

    if (uploadedPath) {
      const previousImagePath = productImagePathFromUrl(existing.image_url);
      if (previousImagePath) await admin.storage.from("product-images").remove([previousImagePath]);
    }

    revalidateCatalog();
    return { ok: true, message: `${parsed.data.name} was updated` };
  } catch (error) {
    if (uploadedPath) await admin.storage.from("product-images").remove([uploadedPath]);
    return { ok: false, message: error instanceof Error ? error.message : "Could not update the product" };
  }
}
