import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    console.log("Uploading file from path:", filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "kisan-setu-shops",
      resource_type: "image",
    });
    console.log("Upload success:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    throw new Error("Failed to upload image");
  }
};
