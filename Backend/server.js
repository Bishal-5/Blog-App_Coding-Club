import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from 'cors';
import db from './config/db.js';
import UserRoutes from './routes/userAuth.js';
import BlogRoutes from './routes/blog.js';
import LikeRoutes from './routes/like.js';
import CommentRoutes from './routes/comment.js';
import FollowRoutes from './routes/follow.js';

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
dotenv.config(); // env variables
db(); // database connection

const corsOptoins = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
} // cors

app.get('/', (_, res) => {
    res.send('Hello!! Welcome To My Server...')

})

app.use(cors(corsOptoins)); // cors
app.use('/user', UserRoutes); // User Signup, Login, Logout, View Profile, Update Profile)
app.use('/blog', BlogRoutes); // Blog CRUD
app.use('/blog/like', LikeRoutes); // Blog Like, Unlike
app.use('/blog/comment', CommentRoutes); // Blog Comment
app.use('/user', FollowRoutes); // Blog Comment

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})