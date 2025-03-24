import BlogModel from '../models/blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const BlogCreate = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Create the blog post
        const CreateBlog = new BlogModel({
            title: title,
            content: content,
            timestamp: new Date()
        });

        // Save the blog post to the database
        await CreateBlog.save();

        // Respond with success message
        const successResponse = new apiResponse(201, CreateBlog, 'Blog Created Successfully');
        res.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal server error', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

export { BlogCreate };