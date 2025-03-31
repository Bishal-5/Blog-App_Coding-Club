import express from 'express'
import { addMiddleware } from '../middleware/jwt.js';
import { addComment, removeComment } from '../controller/comment.js';

const CommentRoutes = express.Router();

CommentRoutes.post('/addComment/:id', addMiddleware, addComment);
CommentRoutes.put('/removeComment/:id', addMiddleware, removeComment);

export default CommentRoutes;