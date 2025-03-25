import express from 'express'
import { ViewAllBlog, viewOnlyBlog, BlogCreate, BlogUpdate, BlogDelete } from "../controller/blog.js";

const BlogRoutes = express.Router();

BlogRoutes.get('/', ViewAllBlog);
BlogRoutes.get('/view', viewOnlyBlog); // Using req.body (Blog Title)
BlogRoutes.get('/view/:id', viewOnlyBlog); // Using req.params.id (Blog ID)
BlogRoutes.post('/create', BlogCreate);
BlogRoutes.post('/update/:id', BlogUpdate);
BlogRoutes.delete('/delete/:id', BlogDelete);

export default BlogRoutes;