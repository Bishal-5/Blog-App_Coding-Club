import express from 'express'
import { addMiddleware } from '../middleware/jwt.js';
import { addLike, unLike } from '../controller/like.js';

const LikeRoutes = express.Router();

LikeRoutes.post('/like/:id', addMiddleware, addLike);
LikeRoutes.put('/unlike/:id', addMiddleware, unLike);

export default LikeRoutes;