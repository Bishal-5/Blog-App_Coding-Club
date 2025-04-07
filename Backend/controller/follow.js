import User from '../models/user.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { notAuthorized, catchError, userNotFound } from '../utils/resFunction.js';
import { apiError } from '../utils/apiError.js';

const follow = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id; // User ID to be followed
        const currentUserID = req.UserInfo.userID; // UserID of the current user
        const currentUsername = req.UserInfo.username; // Username of the current user

        // Check if the user is authorized to follow another user
        if (!currentUsername) {
            return notAuthorized(res);
        }

        if (userId === currentUserID) {
            return res
                .status(400)
                .json(new apiError(400, null, 'You cannot follow yourself'));

        }

        // Check if the user to be followed exists
        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return userNotFound(res);
        }

        // Check if the current user is already following the user
        const isFollowing = userToFollow.followersList.includes(currentUsername);

        if (isFollowing) {
            return res
                .status(400)
                .json(new apiError(400, null, 'Already following this user'));
        }

        // Add the user to the current user's following list
        await User.findByIdAndUpdate(currentUserID, {
            $addToSet: { followingList: userToFollow.username },
            $inc: { following: 1 }
        });

        // Add the current user to the followed user's followers list
        await User.findByIdAndUpdate(userId, {
            $addToSet: { followersList: currentUsername },
            $inc: { followers: 1 }
        });

        return res
            .status(200)
            .json(new apiResponse(200, null, 'Followed successfully'));

    } catch (error) {
        return catchError(res, error);
    }
})

const unfollow = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id; // User ID to be unfollowed
        const currentUserID = req.UserInfo.userID; // UserID of the current user
        const currentUsername = req.UserInfo.username; // Username of the current user

        // Check if the user is authorized to unfollow another user
        if (!currentUsername) {
            return notAuthorized(res);
        }

        const userToFollow = await User.findById(userId);

        if (!userToFollow) {
            return userNotFound(res);
        }

        if (userId === currentUserID) {
            return res
                .status(400)
                .json(new apiError(400, null, 'You cannot unfollow yourself'));

        }

        const isFollowing = userToFollow.followersList.includes(currentUsername);

        if (!isFollowing) {
            return res
                .status(400)
                .json(new apiError(400, null, 'Not following this user'));
        }

        // Remove the user to the current user's following list
        await User.findByIdAndUpdate(currentUserID, {
            $pull: { followingList: userToFollow.username },
            $inc: { following: -1 }
        });

        // Add the current user to the followed user's followers list
        await User.findByIdAndUpdate(userId, {
            $pull: { followersList: currentUsername },
            $inc: { followers: -1 }
        });

        return res
            .status(200)
            .json(new apiResponse(200, null, 'Unfollowed successfully'));

    } catch (error) {
        return catchError(res, error);
    }
})

export { follow, unfollow };