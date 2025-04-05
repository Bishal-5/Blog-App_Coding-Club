import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// File upload on cloudinary
const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error('No local file path provided!');
            return null;
        }

        // Upload file on cloudinary
        const uploadFile = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: "image",
            })
        return uploadFile.url; // Return the URL of the uploaded file

    } catch (error) {
        // If uploaded file saved in local then delete that file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Deleted the temporary file.");
        } else {
            console.error('File not found for deletion:', localFilePath);
        }
        return null;
    }
}

// Get Public ID from URL
const getPublicId = (url) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0]; // Remove the file extension
    return publicId;
}

// Delete file from cloudinary
const deleteCloudinary = async (getPublicId) => {
    try {
        if (!getPublicId) {
            console.error('No public ID provided!');
            return false;
        }

        // Delete file from cloudinary
        const deleteFile = await cloudinary.uploader.destroy(getPublicId, {
            resource_type: "image",
        })
        if (deleteFile.result === "ok") {
            console.log(`File deleted successfully from Cloudinary: ${getPublicId}`);
            return true;
        }else{
            console.error(`Failed to delete file from Cloudinary: ${getPublicId}`);
            return false;
        }

    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return false;
    }
}

export { uploadCloudinary, getPublicId, deleteCloudinary };