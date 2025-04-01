import express from 'express'
import { addMiddleware } from '../middleware/jwt.js';
import { addComment, removeComment } from '../controller/comment.js';

const CommentRoutes = express.Router();

CommentRoutes.post('/add/:id', addMiddleware, addComment); // Add Comment
CommentRoutes.put('/remove/:id', addMiddleware, removeComment); // Remove Comment

export default CommentRoutes;