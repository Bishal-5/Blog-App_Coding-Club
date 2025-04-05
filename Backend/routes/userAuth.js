import express from 'express'
import { Register, Login, Logout, updateProfile, viewProfile } from '../controller/userAuth.js'
import { addMiddleware } from '../middleware/jwt.js';
import { upload } from '../middleware/multer.js';

const AuthRoutes = express.Router();


AuthRoutes.post('/register', upload.single('image'), Register); // Register new user
AuthRoutes.post('/login', Login); // Login existing user
AuthRoutes.post('/logout', addMiddleware, Logout); // Login existing user
AuthRoutes.put('/updateprofile', addMiddleware, upload.single('image'), updateProfile); // Profile Update
AuthRoutes.get('/viewprofile', addMiddleware, viewProfile); // View Profile

export default AuthRoutes;