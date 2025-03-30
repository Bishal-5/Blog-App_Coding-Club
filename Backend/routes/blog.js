import express from 'express'
import { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete } from "../controller/blog.js";
import { addMiddleware } from '../middleware/jwt.js';

const BlogRoutes = express.Router();

BlogRoutes.get('/', addMiddleware, ViewAllBlog);
// BlogRoutes.get('/view', addMiddleware, viewOnlyBlog); // Using req.body (Blog Title)
BlogRoutes.get('/view/:id', addMiddleware, viewOnlyBlog); // Using req.params.id (Blog ID)
BlogRoutes.post('/create',addMiddleware, BlogCreate);
BlogRoutes.put('/update/:id', addMiddleware, BlogUpdate);
BlogRoutes.delete('/delete/:id', addMiddleware, BlogDelete);

export default BlogRoutes;