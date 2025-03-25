import BlogModel from '../models/blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const ViewAllBlog=async(req,res)=>{
    try {
        const allBlog= await BlogModel.find()
        console.log(allBlog);
        
        if (!allBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
        const successResponse = new apiResponse(200, allBlog);
        res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

const BlogCreate = asyncHandler(async (req, res) => {
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
        const successResponse = new apiResponse(201, CreateBlog, 'Blog Created Successfully!');
        res.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
})

const BlogUpdate = asyncHandler (async (req, res) => {
    try {
        // const { title, content } = req.body;
        const updateContent = req.body;
        const blogId = req.params.id;

        const findBlog = await BlogModel.findById(blogId);
        if (!findBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        const blogToUpdate = await BlogModel.findByIdAndUpdate(blogId, updateContent, {
            new: true,
            runValidators: true,
        });

        const successResponse = new apiResponse(200, blogToUpdate, 'Blog Updated Successfully!');
        res.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
})

const BlogDelete = async (req, res) => {
    try {
        const blogId = req.params.id;

        const findBlog = await BlogModel.findById(blogId);
        if (!findBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
        const blogToDelete = await BlogModel.findByIdAndDelete(blogId);
        const successResponse = new apiResponse(200, blogToDelete.title, 'Blog Deleted Successfully!');
        res.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

const viewOnlyBlog = async (req, res) => {
    try {
        // const blogTitle = req.body; // Using req.body (Blog Title)
        const blogTitle = req.params.id; // Using req.params.id (Blog ID)
        // const findBlog = await BlogModel.findOne(blogTitle); // Using req.body (Blog Title)
        const findBlog = await BlogModel.findById(blogTitle); // Using req.params.id (Blog ID)
        if (!findBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
        const successResponse = new apiResponse(200, findBlog);
        res.status(successResponse.statusCode).json(successResponse);
    }
    catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

export { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete };