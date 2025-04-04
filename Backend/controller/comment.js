import Blog from "../models/blog.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Add New Comment
const addComment = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const { text } = req.body; // Extract the comment text from the request body

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
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

        return res
            .status(201)
            .json(
                new apiResponse(201, { Comment: newComment.text }, 'Comment Added!')
            );

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
});

// Remove a comment
const removeComment = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const userID = req.UserInfo.userID;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        if ((!blogPost.comments) || (blogPost.comments.length === 0)) {
            return res
                .status(404)
                .json(new apiError(404, 'No comments found!'));
        }

        const userComment = await blogPost.comments.filter(comment => comment.user === userName);

        if ((userComment) || blogPost.user.toString() === userID) {
            // Remove the comment from the comments array
            await Blog.updateOne(blogPost, { $pull: { comments: { user: userName } } });

            return res
                .status(201)
                .json(
                    new apiResponse(201, { Comment: userComment.text }, 'Comment Removed!')
                );
        } else {
            return res
                .status(403)
                .json(new apiError(403, 'You are not authorized to remove this comment!'));
        }

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
});

export { addComment, removeComment };