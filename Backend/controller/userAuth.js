import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateToken } from '../middleware/jwt.js';
import { uploadCloudinary, getPublicId, deleteCloudinary } from '../config/cloudinary.js';
import { userNotFound, catchError, blankField, cloudinaryResponse } from '../utils/resFunction.js';

// Register User
const Register = asyncHandler(async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body
        const existUser = await User.findOne({ $or: [{ email }, { fullName }] });

        if (!email || !password || !fullName) {
            return blankField(res);
        }

        if (existUser) {
            return res
                .status(301)
                .json(new apiError(301, 'User Already Exist. Please Login!'));
        }

        const hashPassword = await bcrypt.hash(password, 12);

        // Generate username from fullName and random number
        let userName = fullName.split(" ")[0].toUpperCase(); // Get the first name and convert to uppercase
        let randomNumber = Math.floor(Math.random() * 900) + 100; // Generate number between 100 and 999
        if (randomNumber > 999) randomNumber = 999; // Ensure the number is not greater than 999
        userName = `${userName}${randomNumber}`; // Create username

        // Set profile photo & Upload image on cloudinary
        let cloudinaryFilePath = null;

        if (req.file) { // If no file uploaded
            const localFilePath = req.file.path // Local file path
            cloudinaryFilePath = await uploadCloudinary(localFilePath);
            cloudinaryResponse(req, res, cloudinaryFilePath);
        }

        const newUser = new User({
            fullName: fullName,
            username: userName,
            email: email,
            profilePicture: cloudinaryFilePath || 'No Profile Picture',
            bio: bio,
            password: hashPassword,
        });

        // Save the user to the database
        await newUser.save();

        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    { username: newUser.username, email: newUser.email },
                    "User Registered Successfully!"
                )
            );
    } catch (error) {
        console.log(error);

        return catchError(res, error);
    };
});

// Login User
const Login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return blankField(res);
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            return userNotFound(res);
        }

        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json(new apiError(400, 'Invalid Password!'));
        }

        // Token Generate
        const payload = {
            username: existUser.username,
            userID: existUser._id
        };

        const token = generateToken(payload);

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        }

        // Set the JWT token in a cookie
        return res
            .cookie('token', token, options)
            .status(200)
            .json(new apiResponse(
                200,
                { username: existUser.username, token: token },
                "User Logged In Successfully!"
            ));
    }
    catch (error) {
        return catchError(res, error);
    };
});

// Logout User
const Logout = asyncHandler(async (req, res) => {
    try {
        const userName = req.UserInfo.username;
        const token = req.cookies['token'];

        // Check if the 'token' cookie exists and has a value
        if (!token) {
            return res
                .status(400)
                .json(new apiError(400, 'No Active Session Found!'));
        }

        // Clear the JWT cookie
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'None',
            maxAge: 0 // Set maxAge to 0 to delete the cookie
        }

        res.clearCookie('token', options);

        return res
            .status(200)
            .json(
                new apiResponse(200, userName, "User Logged Out Successfully!")
            );

    } catch (error) {
        return catchError(res, error);
    }
});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
    try {
        const userID = req.UserInfo.userID;
        let existUser = await User.findById(userID);
        let hashNewPassword = existUser.password;
        const { fullName, userName, email, bio, removeProfilePicture, oldPassword, newPassword } = req.body;

        // Change profile photo & Upload image on cloudinary
        let cloudinaryFilePath = existUser.profilePicture || null;

        if (removeProfilePicture === 'true') {
            // Cloudinary API to delete the image from Cloudinary
            if (existUser.profilePicture  !== 'No Profile Picture') {
                const publicId = getPublicId(existUser.profilePicture);
                await deleteCloudinary(publicId);
            }
            cloudinaryFilePath = 'No Profile Picture';

        } else if (req.file) {
            const localFilePath = await req.file.path // Local file path
            if (existUser.profilePicture  !== 'No Profile Picture') {
                const publicId = getPublicId(existUser.profilePicture);
                await deleteCloudinary(publicId);
            }
            cloudinaryFilePath = await uploadCloudinary(localFilePath);
            cloudinaryResponse(req, res, cloudinaryFilePath);
        }

        // Change Password
        if (!oldPassword && !newPassword) null;
        else if (oldPassword && !newPassword) {
            return res
                .status(400)
                .json(new apiError(400, 'New Password Cannot Be Empty!'));
        }
        else if (!oldPassword && newPassword) {
            return res
                .status(400)
                .json(new apiError(400, 'Old Password Cannot Be Empty!'));
        }
        else if (oldPassword && newPassword) {
            if (oldPassword === newPassword) {
                return res
                    .status(400)
                    .json(new apiError(400, 'New Password Cannot Be Same as Old Password!'));
            }

            const isPasswordCorrect = await bcrypt.compare(oldPassword, existUser.password);

            if (!isPasswordCorrect) {
                return res
                    .status(400)
                    .json(new apiError(400, 'Incorrect Old Password!'));
            }

            hashNewPassword = await bcrypt.hash(newPassword, 12);
        }

        await User.findByIdAndUpdate(userID, {
            fullName: fullName,
            username: userName,
            profilePicture: cloudinaryFilePath,
            password: hashNewPassword,
            bio: bio,
            email: email
        });

        return res
            .status(200)
            .json(new apiResponse(200, "Profile Updated Successfully!"));

    } catch (error) {
        return catchError(res, error);
    }
})

// View Profile
const viewProfile = asyncHandler(async (req, res) => {
    try {
        const userID = req.UserInfo.userID;

        const existUser = await User.findById(userID).select('-password -__v -_id');
        // select('-password -__v') => Exclude password and __v field from the response

        if (!existUser) {
            return userNotFound(res);
        }

        return res
            .status(200)
            .json(new apiResponse(200, existUser, "Profile Fetched Successfully!"));
    } catch (error) {
        return catchError(res, error);
    }
})

export { Register, Login, Logout, updateProfile, viewProfile };