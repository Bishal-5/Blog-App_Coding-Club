import express from 'express'
import { Register, Login, Logout, changePassword } from '../controller/userAuth.js'
import { addMiddleware } from '../middleware/jwt.js';

const AuthRoutes = express.Router();


AuthRoutes.post('/register', Register); // Register new user
AuthRoutes.post('/login', Login); // Login existing user
AuthRoutes.post('/logout', addMiddleware, Logout); // Login existing user
AuthRoutes.put('/changepassword',addMiddleware, changePassword); // Password Change

export default AuthRoutes;