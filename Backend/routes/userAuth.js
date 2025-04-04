import express from 'express'
import { Register, Login, Logout } from '../controller/userAuth.js'

const AuthRoutes = express.Router();


AuthRoutes.post('/register', Register); // Register new user
AuthRoutes.post('/login', Login); // Login existing user
AuthRoutes.post('/logout', Logout); // Login existing user

export default AuthRoutes;