import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';

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
        req.UserInfo = decoded;

        next();
    } catch (error) {
        console.error('Error during token verification', error);
        const errorResponse = new apiError(401, 'Invalid Token!', error.message);
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}

// Generate Token
const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '' });
}

export { addMiddleware, generateToken };