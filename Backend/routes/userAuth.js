import express from 'express'
import { Register, Login } from '../controller/userAuth.js'

const AuthRoutes = express.Router();


AuthRoutes.post('/register', Register); // Register new user
AuthRoutes.post('/login', Login); // Login existing user

export default AuthRoutes;