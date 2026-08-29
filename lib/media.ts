import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const PRIVATE_IMAGE_BUCKET = "profile-images";
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

async function uploadImage(bucket: string, path: string, body: Buffer, contentType: string) {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).upload(path, body, {
    contentType,
    cacheControl: "31536000",
    upsert: false
  });
  if (error) throw new Error(error.message);
}

type PrivateImageScope = "self" | "recipients";

function mediaUploadError(message: string) {
  if (message.includes("media_upload_rate_limit")) {
    return new Error("Too many image uploads. Try again in 10 minutes.");
  }
  if (message.includes("media_upload_count_limit")) {
    return new Error("You have reached the 50-image limit. Replace an existing image before uploading another.");
  }
  if (message.includes("media_upload_storage_limit")) {
    return new Error("You have reached the 100 MB image storage limit.");
  }
  return new Error(message);
}

async function reservePrivateImage(userId: string, scope: PrivateImageScope, path: string, sizeBytes: number) {
  const { error } = await createAdminClient().rpc("reserve_media_upload", {
    p_user_id: userId,
    p_bucket_id: PRIVATE_IMAGE_BUCKET,
    p_object_path: path,
    p_scope: scope,
    p_size_bytes: sizeBytes
  });
  if (error) throw mediaUploadError(error.message);
}

async function finishPrivateImage(userId: string, path: string, succeeded: boolean) {
  const { error } = await createAdminClient().rpc(
    succeeded ? "complete_media_upload" : "fail_media_upload",
    {
      p_user_id: userId,
      p_bucket_id: PRIVATE_IMAGE_BUCKET,
      p_object_path: path
    }
  );
  if (error) throw new Error(error.message);
}

async function removeConnectedPlainBackground(file: File) {
  const source = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(source)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixelCount = width * height;
  const cornerIndexes = [0, width - 1, (height - 1) * width, pixelCount - 1];
  const opaqueCorners = cornerIndexes.filter(index => data[index * channels + 3] > 220);
  if (opaqueCorners.length < 2) {
    return sharp(data, { raw: info }).png({ compressionLevel: 9 }).toBuffer();
  }

  const background = opaqueCorners.reduce((sum, index) => {
    const offset = index * channels;
    sum[0] += data[offset];
    sum[1] += data[offset + 1];
    sum[2] += data[offset + 2];
    return sum;
  }, [0, 0, 0]).map(value => value / opaqueCorners.length);
  const toleranceSquared = 58 * 58;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  function matchesBackground(index: number) {
    const offset = index * channels;
    if (data[offset + 3] < 16) return true;
    const red = data[offset] - background[0];
    const green = data[offset + 1] - background[1];
    const blue = data[offset + 2] - background[2];
    return red * red + green * green + blue * blue <= toleranceSquared;
  }

  function enqueue(index: number) {
    if (visited[index] || !matchesBackground(index)) return;
    visited[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    data[index * channels + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  return sharp(data, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function uploadPrivateProfileImage(userId: string, scope: PrivateImageScope, file: File) {
  const extension = validateImage(file);
  const path = `${userId}/${scope}/${randomUUID()}.${extension}`;
  await reservePrivateImage(userId, scope, path, file.size);

  try {
    await uploadImage(PRIVATE_IMAGE_BUCKET, path, Buffer.from(await file.arrayBuffer()), file.type);
  } catch (error) {
    await finishPrivateImage(userId, path, false).catch(() => undefined);
    throw error;
  }

  try {
    await finishPrivateImage(userId, path, true);
  } catch (error) {
    await createAdminClient().storage.from(PRIVATE_IMAGE_BUCKET).remove([path]);
    await finishPrivateImage(userId, path, false).catch(() => undefined);
    throw error;
  }

  return path;
}

export async function removePrivateProfileImage(userId: string, path?: string | null) {
  if (!path || !path.startsWith(`${userId}/`)) return;

  const { error: storageError } = await createAdminClient()
    .storage
    .from(PRIVATE_IMAGE_BUCKET)
    .remove([path]);
  if (storageError) throw new Error(storageError.message);

  const { error: ledgerError } = await createAdminClient().rpc("delete_media_upload", {
    p_user_id: userId,
    p_bucket_id: PRIVATE_IMAGE_BUCKET,
    p_object_path: path
  });
  if (ledgerError) throw new Error(ledgerError.message);
}

export async function uploadPublicProductImage(userId: string, file: File, removeBackground = true) {
  const extension = validateImage(file);
  const body = removeBackground ? await removeConnectedPlainBackground(file) : Buffer.from(await file.arrayBuffer());
  const outputExtension = removeBackground ? "png" : extension;
  const contentType = removeBackground ? "image/png" : file.type;
  const path = `${userId}/${randomUUID()}.${outputExtension}`;
  await uploadImage("product-images", path, body, contentType);
  const { data } = createAdminClient().storage.from("product-images").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function getPrivateProfileImageUrl(path?: string | null) {
  if (!path) return null;
  const { data, error } = await createAdminClient().storage.from(PRIVATE_IMAGE_BUCKET).createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}
