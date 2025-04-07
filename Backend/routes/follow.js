import express from 'express'
import { follow, unfollow } from "../controller/follow.js";
import { addMiddleware } from '../middleware/jwt.js';

const FollowRoutes = express.Router();

FollowRoutes.post('/follow/:id', addMiddleware, follow); // Follow a user
FollowRoutes.post('/unfollow/:id', addMiddleware, unfollow); // Unfollow a user

export default FollowRoutes;