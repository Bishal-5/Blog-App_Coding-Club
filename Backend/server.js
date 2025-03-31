import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import db from './config/db.js';
import UserRoutes from './routes/userAuth.js';
import BlogRoutes from './routes/blog.js';
import LikeRoutes from './routes/like.js';

const app = express();
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
dotenv.config(); // env variables
db(); // database connection

const corsOptoins = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
} // cors

app.get('/', (req, res) => {
    res.send('Hello!! Welcome To My Server...');
})

app.use(cors(corsOptoins)); // cors
app.use('/user', UserRoutes); // User SignUP & Login
app.use('/blog', BlogRoutes); // Blog CRUD
app.use('/blog', LikeRoutes); // Blog Like, Unlike

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})