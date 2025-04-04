import jwt from 'jsonwebtoken';
import { apiError } from '../utils/apiError.js';

// Add Middleware to verify the token
const addMiddleware = (req, res, next) => {
    let token = req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res
            .status(401)
            .json(new apiError(401, 'Token Not Found!'));
    }
    try {
        token = token.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json(new apiError(401, 'Inavlid Token!', err.message));
            }

            // Attach the decoded user information to the request object
            req.UserInfo = decoded;
            next();
        });

    } catch (error) {
        return res
        .status(500)
        .json( new apiError(500, 'Something Went Wrong!', error));
    }
}

// Generate Token
const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
}

export { addMiddleware, generateToken };