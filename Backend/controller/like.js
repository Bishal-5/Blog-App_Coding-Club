import Blog from "../models/blog.js";
import User from "../models/user.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

const addLike = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const userID = req.UserInfo._id;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Check if the user has already liked the post        
        const alreadyLiked = blogPost.likedBy.includes(userName);

        if (alreadyLiked) {
            const errorResponse = new apiError(400, 'You have already liked this Blog!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Add the username to the likedBy array and increment likes count
        blogPost.likedBy.push(userName);
        blogPost.likes += 1;
        await blogPost.save();

        // Add the blog title to the user's likedBlogs array
        const findUser = await User.findOne({username: userName});
        await User.updateOne(findUser, { $addToSet: { likedBlogs: blogPost.title } });

        const successResponse = new apiResponse(201, { Like: blogPost.likes }, 'Like Added!');
        res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
});

const unLike = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;
        const userID = req.UserInfo._id;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            const errorResponse = new apiError(404, 'Blog not found!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Check if the user has already liked the post        
        const alreadyLiked = blogPost.likedBy.includes(userName);

        if (!alreadyLiked) {
            const errorResponse = new apiError(400, 'You Have Not Liked This Blog!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Add the username to the likedBy array and increment likes count
        await Blog.updateOne(blogPost, { $pull: { likedBy: userName } });
        blogPost.likes -= 1;
        await blogPost.save();

        // Remove the blog title from the user's likedBlogs array
        await User.updateOne({username: userName}, { $pull: { likedBlogs: blogPost.title } });

        const successResponse = new apiResponse(201, 'Blog Unliked!');
        res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error(error);
        const errorResponse = new apiError(500, 'Internal Server Error!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
})

export { addLike, unLike };