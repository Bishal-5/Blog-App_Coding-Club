import Blog from "../models/blog.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { blogNotFound, catchError, notAuthorized } from '../utils/resFunction.js';

// Add New Comment
const addComment = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const { text } = req.body; // Extract the comment text from the request body

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return blogNotFound(res);
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
        return catchError(res, error);
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
            return blogNotFound(res);
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
            return notAuthorized(res);
        }

    } catch (error) {
        return catchError(res, error);
    }
});

export { addComment, removeComment };