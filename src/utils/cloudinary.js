import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if localFilePath is provided
    if (!localFilePath) {
      console.error("Local file path is missing");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded successfully! ", response.url);
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // If an error occurs during upload, clean up the local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted after upload error");
    }

    return null;
  }
};

export { uploadOnCloudinary };
