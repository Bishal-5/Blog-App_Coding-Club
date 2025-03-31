import Blog from '../models/blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// View all blog posts
const ViewAllBlog = asyncHandler(async (req, res) => {
    try {
        const allBlog = await Blog.find()

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
})

// Create a new blog post
const BlogCreate = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;

        // Create the blog post
        const CreateBlog = new Blog({
            authorId: req.UserInfo.userID, 
            title: title,
            content: content,
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

// Update a blog post
const BlogUpdate = asyncHandler(async (req, res) => {
    try {
        // const { title, content } = req.body;
        const updateContent = req.body;
        const blogId = req.params.id;
        
        const findBlog = await Blog.findById(blogId);
        
        if (!findBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
        
        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== req.UserInfo.userID.toString()) { 
            // req.UserInfo.userID is used to get the user ID from the JWT token
            const errorResponse = new apiError(403, 'You are not authorized!');
            return res.status(errorResponse.statusCode).json(errorResponse);
            
        }

        const blogToUpdate = await Blog.findByIdAndUpdate(blogId, updateContent, {
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

// Delete a blog post
const BlogDelete = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;

        const findBlog = await Blog.findById(blogId);
        if (!findBlog) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== req.UserInfo.userID.toString()) { 
            // req.UserInfo.userID is used to get the user ID from the JWT token
            const errorResponse = new apiError(403, 'You are not authorized!');
            return res.status(errorResponse.statusCode).json(errorResponse);
            
        }

        const blogToDelete = await Blog.findByIdAndDelete(blogId);
        const successResponse = new apiResponse(200, blogToDelete.title, 'Blog Deleted Successfully!');
        res.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
})

// View only one blog post
const viewOnlyBlog = asyncHandler(async (req, res) => {
    try {
        // const blogTitle = req.body; // Using req.body (Blog Title)
        const blogTitle = req.params.id; // Using req.params.id (Blog ID)
        // const findBlog = await Blog.findOne(blogTitle); // Using req.body (Blog Title)
        const findBlog = await Blog.findById(blogTitle); // Using req.params.id (Blog ID)

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
})

export { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete };