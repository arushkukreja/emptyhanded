import "server-only";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

function validateImage(file: File) {
  if (!file.size) throw new Error("Choose an image to upload");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Images must be 5 MB or smaller");
  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) throw new Error("Use a JPG, PNG, or WebP image");
  return extension;
}

async function uploadImage(bucket: string, path: string, file: File) {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false
  });
  if (error) throw new Error(error.message);
}

export async function uploadPrivateProfileImage(userId: string, scope: "self" | "recipients", file: File) {
  const extension = validateImage(file);
  const path = `${userId}/${scope}/${randomUUID()}.${extension}`;
  await uploadImage("profile-images", path, file);
  return path;
}

export async function uploadPublicProductImage(userId: string, file: File) {
  const extension = validateImage(file);
  const path = `${userId}/${randomUUID()}.${extension}`;
  await uploadImage("product-images", path, file);
  const { data } = createAdminClient().storage.from("product-images").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function getPrivateProfileImageUrl(path?: string | null) {
  if (!path) return null;
  const { data, error } = await createAdminClient().storage.from("profile-images").createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}
