"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { removePrivateProfileImage, uploadPrivateProfileImage } from "@/lib/media";

export type ProfileFormState = { ok: boolean; message: string };

export async function updateOwnProfile(_previous: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in again to continue" };

  const displayName = z.string().trim().min(2, "Enter your name").max(100).safeParse(formData.get("display_name"));
  if (!displayName.success) return { ok: false, message: displayName.error.issues[0]?.message ?? "Check your name" };

  let avatarPath: string | null = null;
  let profileUpdated = false;
  try {
    const { data: existingProfile } = await supabase
      .from("users")
      .select("avatar_path")
      .eq("id", user.id)
      .maybeSingle();
    const image = formData.get("image");
    avatarPath = image instanceof File && image.size ? await uploadPrivateProfileImage(user.id, "self", image) : null;
    const admin = createAdminClient();
    const { error } = await admin.from("users").update({ display_name: displayName.data, ...(avatarPath ? { avatar_path: avatarPath } : {}) }).eq("id", user.id);
    if (error) throw new Error(error.message);
    profileUpdated = true;
    if (avatarPath && existingProfile?.avatar_path && existingProfile.avatar_path !== avatarPath) {
      await removePrivateProfileImage(user.id, existingProfile.avatar_path).catch(() => undefined);
    }
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { ok: true, message: "Your profile was updated" };
  } catch (error) {
    if (avatarPath && !profileUpdated) await removePrivateProfileImage(user.id, avatarPath).catch(() => undefined);
    return { ok: false, message: error instanceof Error ? error.message : "Could not update your profile" };
  }
}
