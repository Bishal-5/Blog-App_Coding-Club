import express from 'express'
import { addMiddleware } from '../middleware/jwt.js';
import { addLike, unLike } from '../controller/like.js';

const LikeRoutes = express.Router();

LikeRoutes.post('/add/:id', addMiddleware, addLike); // Like
LikeRoutes.put('/remove/:id', addMiddleware, unLike); // Unlike

export default LikeRoutes;