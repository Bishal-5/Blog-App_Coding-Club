import Blog from "../models/blog.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addComment = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const { text } = req.body; // Extract the comment text from the request body

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Create a new comment object
        const newComment = {
            user: userName,
            text: text,
            timestamp: new Date(),
        };

        // Add the comment to the blog post's comments array
        blogPost.comments.push(newComment);
        await blogPost.save();

        const successResponse = new apiResponse(201, { Comment: newComment.text }, 'Comment Added!');
        res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
});

const removeComment = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const userID = req.UserInfo.userID;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        if ((!blogPost.comments) || (blogPost.comments.length === 0)) {
            const errorResponse = new apiError(404, 'No comments found!');
            return res.status(errorResponse.statusCode).json(errorResponse);

        }

        const userComment = await blogPost.comments.filter(comment => comment.user === userName);

        if ((!userComment) || (blogPost.authorId.toString() !== userID)) {
            const errorResponse = new apiError(403, 'You are not authorized to delete this comment!');
            return res.status(errorResponse.statusCode).json(errorResponse);

        }

        // Remove the comment from the comments array
        await Blog.updateOne(blogPost, { $pull: { comments: { user: userName } } });

        const successResponse = new apiResponse(200, null, 'Comment Removed!');
        res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
});

export { addComment, removeComment };