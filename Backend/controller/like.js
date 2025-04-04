import Blog from "../models/blog.js";
import User from "../models/user.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Like Blog Post
const addLike = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        // Check if the user has already liked the post        
        const alreadyLiked = blogPost.likedBy.includes(userName);

        if (alreadyLiked) {
            return res
                .status(400)
                .json(new apiError(400, 'You have already liked this Blog!'));
        }

        // Add the username to the likedBy array and increment likes count
        blogPost.likedBy.push(userName);
        blogPost.likes += 1;
        await blogPost.save();

        // Add the blog title to the user's likedBlogs array
        const findUser = await User.findOne({ username: userName });
        await User.updateOne(findUser, { $addToSet: { likedBlogs: blogPost.title } });

        return res
            .status(201)
            .json(
                new apiResponse(201, { Like: blogPost.likes }, 'Like Added!')
            );

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
});

// Unlike Blog Post
const unLike = asyncHandler(async (req, res) => {
    try {
        const blogId = req.params.id;
        const userName = req.UserInfo.username;

        const blogPost = await Blog.findById(blogId);

        if (!blogPost) {
            return res
                .status(404)
                .json(new apiError(404, 'Blog not found!'));
        }

        // Check if the user has already liked the post        
        const alreadyLiked = blogPost.likedBy.includes(userName);

        if (!alreadyLiked) {
            return res
                .status(404)
                .json(new apiError(400, 'You Have Not Liked This Blog!'));
        }

        // Add the username to the likedBy array and increment likes count
        await Blog.updateOne(blogPost, { $pull: { likedBy: userName } });
        blogPost.likes -= 1;
        await blogPost.save();

        // Remove the blog title from the user's likedBlogs array
        await User.updateOne({ username: userName }, { $pull: { likedBlogs: blogPost.title } });

        return res
            .status(201)
            .json(
                new apiResponse(201, { Like: blogPost.likes }, 'Like Removed!')
            );

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, 'Internal Server Error!', error.message));
    }
})

export { addLike, unLike };