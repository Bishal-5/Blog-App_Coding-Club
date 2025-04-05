import { apiError } from './apiError.js';
import fs from "fs";

const userNotFound = (res) => {
    return res
        .status(404)
        .json(new apiError(404, 'User Not Found!'));
}

const catchError = (res, error) => {
    return res
        .status(500)
        .json(new apiError(500, 'Something Went Wrong!', error.message));
}

const blankField = (res) => {
    return res
        .status(400)
        .json(new apiError(400, 'Please Provide Required Details!'));
}

const cloudinaryResponse = (req, res, cloudinaryPath) => {
    try {
        if (!cloudinaryPath) {
            return res
                .status(500)
                .json(new apiError(500, 'Upload to Cloudinary failed'));
        }

        if (cloudinaryPath) {
            fs.unlinkSync(req.file.path); // If uploaded to Cloudinary, delete the local file
            console.log('File Uploaded Successfully! \n Cloudinary Path: ', cloudinaryPath);
        }
    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Cloudinary Error!', error.message));
    }
}

const blogNotFound = (res) => {
    return res
        .status(404)
        .json(new apiError(404, 'Blog not found!'));
}

const notAuthorized = (res) => {
    return res
        .status(403)
        .json(new apiError(403, 'You are not authorized!'));
}



export { userNotFound, catchError, blankField, cloudinaryResponse, blogNotFound, notAuthorized };