# Blog Website

A clean, modern, and user-friendly blog website designed to share articles, ideas, and stories, inspired by the popular platform [Medium](https://medium.com/). The website allows users to create, read, and interact with blog posts, with a simple and intuitive interface.

## Features

- **User Authentication**: Users can Sign up, Log in, and Manage or update their Profiles.
- **Create & Edit Blog Posts**: Authors can Create, Edit & Delete their blog posts and All users can Read blogs.
- **Comment Section**: Readers can leave Comments on a blog posts & also delete their comments.
- **Post Interaction**: Like/Unlike to any blog posts.
- **Follow - Unfollow**: User can follow or unfollow any user.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Search Functionality**: Users can search for posts by keywords or categories.
- **Categories & Tags**: Organize content into categories with tags for easy navigation.
- **Rich Text Editor**: Authors can format their blog posts with a rich text editor.

## Technologies Used

- **Frontend**:
  - React.js 
  - Tailwind CSS 

- **Backend**:
  - Node.js with Express.js (for RESTful API)
  - Database: MongoDB 
  - Cloudinary and Multer
  - Authentication: JWT (JSON Web Tokens) for user authentication

- **Deployment**:
  - Hosting: Vercel, Netlify
  - Backend Deployment: Heroku, AWS, or DigitalOcean
  - CI/CD Integration: GitHub Actions, CircleCI, etc.

### Clone This Repository

```bash
git clone https://github.com/Bishal-5/Blog-App.git
```
 
## NodeJS Server Setup Guide

- `npm init` or `npm init -y` : Initialize Node Server.
- `npm i` : Install all dependencies those are include in package.json file. Also you can install all libraries manually.
- `node server.js` or `npm start` : Run the development server. (Node Server)

## API Endpoints

**USER ROUTE**
- `POST /user/register` : Register a new user.
- `POST /user/login` : Login an existing user.
- `POST /user/logout` : Logout user.
- `POST /user/updateprofile` : Update profile.
- `POST /user/viewprofile` : View profile.

**BLOG ROUTE (LOGIN REQUIRED)**
- `GET /blog` : View all blogs.
- `GET /blog/view/:id` : View a specific one blog.
- `POST /blog/create` : Create New Blog.
- `PUT /blog/update/:id` : Update an existing blog.
- `DELETE /blog/delete/:id` : Delete an existing blog.

**LIKE - UNLIKE ROUTE (LOGIN REQUIRED)**
- `POST /blog/like/add/:id` : Like a Blog Post.
- `PUT /blog/like/remove/:id` : Unlike a Liked Blog Post.

**COMMENTS ROUTE (LOGIN REQUIRED)**
- `POST /blog/comment/add/:id` : Add Comment on a Blog Post.
- `PUT /blog/comment/remove/:id` : Remove Comment from a Blog Post.

**FOLLOW - UNFOLLOW ROUTE (LOGIN REQUIRED)**
- `POST /user/follow/:id` : Follow.
- `POST user/unfollow/:id` : Unfollow.

## API Documentation
- **Request - Response**
  [Read Docs](https://docs.google.com/document/d/1mVF_syyMn2uXsXeGTygyzUGr4nrh5jqIVnBw7ThfB3M/edit?usp=drive_link)

## Software & Tools

- Node
- Git & Github
- Postman
- Thunder Client

## ***Thank You!***