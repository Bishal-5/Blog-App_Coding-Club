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
        const existUser = await UserModel.findOne({ email })
        if (existUser) {
            const errorResponse = new apiError(301, 'User Already Exist. Please Login!');
            return res.status(errorResponse.statusCode).json(errorResponse);
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
        });

        // Save the user to the database
        await newUser.save();

        const successResponse = new apiResponse(201, newUser, "User Registered Successfully!");
        return res.status(successResponse.statusCode).json(successResponse);

    } catch (error) {
        console.error('Error during registration', error);
        const errorResponse = new apiError(500, "Error during registration", error.message);
        return res.status(errorResponse.statusCode).json(errorResponse);
    }
})

// Login User
const Login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const errorResponse = new apiError(400, "Please provide Email and Password");
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        const existUser = await User.findOne({ email });

        if (!existUser) {
            const errorResponse = new apiError(404, "User Not Found");
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if (!isPasswordCorrect) {
            const errorResponse = new apiError(400, "Incorrect Password");
            return res.status(errorResponse.statusCode).json(errorResponse);
        }

        // Token Generate
        const payload = {
            username: existUser.username
        };

        const token = generateToken(payload);

        const successResponse = new apiResponse(200, existUser.username, "User Logged In Successfully!");
        return res.status(successResponse.statusCode).json({ Response: successResponse, token: token });
    }
    catch (error) {
        console.error('Error during login', error);
        const errorResponse = new apiError(500, "Error during login", error.message);
        return res.status(errorResponse.statusCode).json(errorResponse);
    }
})

export { Register, Login };