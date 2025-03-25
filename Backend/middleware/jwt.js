import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';

// Add Middleware to verify the token
const addMiddleware = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        const errorResponse = new apiError(401, 'Token Not Found!');
        return res.status(errorResponse.statusCode).json(errorResponse);
    }
    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Error during token verification', error);
        const errorResponse = new apiError(401, 'Invalid Token!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

// Generate Token
const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '5d' });
}

export { addMiddleware, generateToken };