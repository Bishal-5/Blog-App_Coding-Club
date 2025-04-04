import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// File upload on cloudinary
const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file on cloudinary
        const uploadFile = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: "image",
                public_id: "photo"
            })

        console.log("File Uploded: ", uploadFile.url);
        return res
            .status(200)
            .json(new apiResponse(200, uploadFile, "File Uploded Successfully!"));

    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
        return null
    }
}

export { uploadCloudinary };