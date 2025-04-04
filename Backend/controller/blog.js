import Blog from '../models/blog.js';
import User from '../models/user.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// View all blog posts
const ViewAllBlog = asyncHandler(async (_, res) => {
    try {
        const allBlog = await Blog.find()

        if (!allBlog) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        return res
            .status(200)
            .json(new apiResponse(200, allBlog,));

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

// Create a new blog post
const BlogCreate = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.UserInfo.userID;

        // Check if the user is authorized to create a blog post
        if (!authorId) {
            return res
                .status(403)
                .json(new apiError(403, 'You are not authorized!'));
        }

        // Create the blog post
        const CreateBlog = new Blog({
            authorId: authorId,
            title: title,
            content: content,
        });

        // Save the blog post to the database
        await CreateBlog.save();

        // Add the blog title to the user's createdBlogs array    
        await User.findByIdAndUpdate(authorId, { $push: { blogsCreated: CreateBlog.title } })

        // Respond with success message
        return res
            .status(201)
            .json(new apiResponse(
                201,
                { title: CreateBlog.title, content: CreateBlog.content },
                'Blog Created Successfully!',
            ));

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

// Update a blog post
const BlogUpdate = asyncHandler(async (req, res) => {
    try {
        // const { title, content } = req.body;
        const updateContent = req.body;
        const blogId = req.params.id;
        const userID = req.UserInfo.userID;

        const findBlog = await Blog.findById(blogId);

        if (!findBlog) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== userID.toString()) {
            // req.UserInfo.userID is used to get the user ID from the JWT token
            return res
                .status(403)
                .json(new apiError(403, 'You are not authorized!'));
        }

        const blogToUpdate = await Blog.findByIdAndUpdate(blogId, updateContent, {
            new: true,
            runValidators: true,
        });

        await User.findByIdAndUpdate(userID, { blogsCreated: blogToUpdate.title })

        return res
            .status(200)
            .json(new apiResponse(
                200,
                { title: blogToUpdate.title, content: blogToUpdate.content },
                'Blog Updated Successfully!',
            ));

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

// Delete a blog post
const BlogDelete = asyncHandler(async (req, res) => {
    try {
        const getBlogID = req.params.id;
        const findBlog = await (Blog.findById(getBlogID));
        const userID = req.UserInfo.userID;

        if (!findBlog) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== userID.toString()) {
            // req.UserInfo.userID is used to get the user ID from the JWT token
            return res
                .status(403)
                .json(new apiError(403, 'You are not authorized!'));
        }

        const blogToDelete = await Blog.findByIdAndDelete(getBlogID);

        await User.findByIdAndUpdate(userID, { $pull: { blogsCreated: blogToDelete.title } })

        return res
            .status(200)
            .json(new apiResponse(200, blogToDelete.title, 'Blog Deleted Successfully!'));

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

// View only one blog post
const viewOnlyBlog = asyncHandler(async (req, res) => {
    try {
        const getBlog = req.params.id
        const findBlog = await Blog.findById(getBlog);

        if (!findBlog) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        return res
            .status(200)
            .json(new apiResponse(200, findBlog));
    }

    catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

export { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete };