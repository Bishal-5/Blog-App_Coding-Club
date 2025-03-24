import express from 'express'
import { BlogCreate } from "../controller/blog.js";

const BlogRoutes = express.Router();


BlogRoutes.post('/create', BlogCreate);
// BlogRoutes.post('/login', Login);

export default BlogRoutes;