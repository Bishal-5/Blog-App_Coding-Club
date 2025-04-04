import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateToken } from '../middleware/jwt.js';

// Register User
const Register = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existUser = await User.findOne({ $or: [{ email }, { username }] });

        if (!email || !password || !username) {
            res
                .status(400)
                .json(new apiError(400, 'Please Provide Email and Password'));
        }

        if (existUser) {
            res
                .status(301)
                .json(new apiError(301, 'User Already Exist. Please Login!'));
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
        });

        // Save the user to the database
        await newUser.save();

        return res
            .status(201)
            .json(new apiResponse(
                201,
                { username: newUser.username, email: newUser.email },
                "User Registered Successfully!"
            ));

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, "Error during registration", error.message))
    };
});

// Login User
const Login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res
                .status(400)
                .json(new apiError(400, 'Please Provide Email and Password'));
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            res
                .status(404)
                .json(new apiError(404, 'User Not Found. Please Register!'));
        }

        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if (!isPasswordCorrect) {
            res
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
        return res
            .status(500)
            .json(new apiError(500, 'Something Went Wrong!', error.message));
    };
});

// Logout User
const Logout = asyncHandler(async (req, res) => {
    try {
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
                new apiResponse(200, null, "User Logged Out Successfully!")
            );

    } catch (error) {
        return res
            .status(500)
            .json(new apiError(500, "Error during logout", error.message));
    }
});

export { Register, Login, Logout };