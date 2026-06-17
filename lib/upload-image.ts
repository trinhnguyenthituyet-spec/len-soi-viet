"use server";

import { cloudinary, cloudinaryConfigured } from "./cloudinary";

export async function uploadImage(file: File, folder = "soi-len-viet") {
  if (!cloudinaryConfigured) {
    throw new Error(
      "Cloudinary chưa được cấu hình — điền CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET thật vào .env trước khi upload ảnh.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, { folder });
  return { url: result.secure_url, publicId: result.public_id };
}
