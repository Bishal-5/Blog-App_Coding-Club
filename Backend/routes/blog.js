import express from 'express'
import { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete } from "../controller/blog.js";
import { addMiddleware } from '../middleware/jwt.js';

const BlogRoutes = express.Router();

BlogRoutes.get('/', addMiddleware, ViewAllBlog); // View all blogs
BlogRoutes.get('/view/:id', addMiddleware, viewOnlyBlog); // View one blog
BlogRoutes.post('/create',addMiddleware, BlogCreate); // Create a new blog
BlogRoutes.put('/update/:id', addMiddleware, BlogUpdate); // Update a existing blog
BlogRoutes.delete('/delete/:id', addMiddleware, BlogDelete); // Delete a existing blog

export default BlogRoutes;