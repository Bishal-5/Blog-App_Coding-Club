import Blog from '../models/blog.js';
import User from '../models/user.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { notAuthorized, catchError, blogNotFound } from '../utils/resFunction.js';

// View all blog posts
const ViewAllBlog = asyncHandler(async (_, res) => {
    try {
        const allBlog = await Blog.find()

        if (allBlog.length === 0) {
            return blogNotFound(res);
        }

        return res
            .status(200)
            .json(new apiResponse(200, allBlog,));

    } catch (error) {
        return catchError(res, error);
    }
})

// Create a new blog post
const BlogCreate = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.UserInfo.userID;

        // Check if the user is authorized to create a blog post
        if (!authorId) {
            return notAuthorized(res);
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

        return res
            .status(201)
            .json(new apiResponse(
                201,
                { title: CreateBlog.title, content: CreateBlog.content },
                'Blog Created Successfully!',
            ));

    } catch (error) {
        return catchError(res, error);
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
            return blogNotFound(res);
        }

        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== userID.toString()) {
            // req.UserInfo.userID is used to get the user ID from the JWT token
            return notAuthorized(res);
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
        return catchError(res, error);
    }
})

// Delete a blog post
const BlogDelete = asyncHandler(async (req, res) => {
    try {
        const getBlogID = req.params.id;
        const findBlog = await (Blog.findById(getBlogID));
        const userID = req.UserInfo.userID;

        if (!findBlog) {
            return blogNotFound(res);
        }

        // Check if the user is authorized to update the blog post
        if (findBlog.authorId.toString() !== userID.toString()) {
            return notAuthorized(res);
        }

        const blogToDelete = await Blog.findByIdAndDelete(getBlogID);

        await User.findByIdAndUpdate(userID, { $pull: { blogsCreated: blogToDelete.title } })

        return res
            .status(200)
            .json(new apiResponse(200, blogToDelete.title, 'Blog Deleted Successfully!'));

    } catch (error) {
        return catchError(res, error);
    }
})

// View only one blog post
const viewOnlyBlog = asyncHandler(async (req, res) => {
    try {
        const getBlog = req.params.id
        const findBlog = await Blog.findById(getBlog);

        if (!findBlog) {
            return blogNotFound(res);
        }

        return res
            .status(200)
            .json(new apiResponse(200, findBlog));
    }

    catch (error) {
        return catchError(res, error);
    }
})

export { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete };