# Blog Website

A clean, modern, and user-friendly blog website designed to share articles, ideas, and stories, inspired by the popular platform [Medium](https://medium.com/). The website allows users to create, read, and interact with blog posts, with a simple and intuitive interface.

## Features

- **User Authentication**: Users can sign up, log in, and manage their profiles.
- **Create & Edit Posts**: Authors can write and edit their blog posts.
- **Comment Section**: Readers can leave comments on posts.
- **Post Interaction**: Like and bookmark posts.
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
  - Authentication: JWT (JSON Web Tokens) for user authentication

- **Deployment**:
  - Hosting: Vercel, Netlify
  - Backend Deployment: Heroku, AWS, or DigitalOcean
  - CI/CD Integration: GitHub Actions, CircleCI, etc.
 
# NodeJS Server Setup Guide

- `npm init` or `npm init -y` : Initialize Node Server.
- `npm i` : Install all dependencies those are include in package.json file. Also you can install all libraries manually.
- `node server.js` or `npm start` : Run the development server. (Node Server)

# API Endpoints

**USER ROUTE**
- `POST /user/register` : Register a new user.
- `POST /user/login` : Login an existing user. (Generate Token)

**BLOG ROUTE (Login Required)**
- `POST /blog/create` : Create New Blog.
- `PUT /blog/update/:id` : Update an existing blog.
- `DELETE /blog/delete/:id` : Delete an existing blog.
- `GET /blog` : View all blogs.
- `GET /blog/view` : View a specific one blog using Blog-Title.
- `GET /blog/view/:id` : View a specific one blog using Blog-ID.

**LIKE - UNLIKE ROUTE (LOGIN REQUIRED)**
- `POST /blog/like/:id` : Like a Blog Post.
- `PUT /blog/unlike/:id` : Unlike a Liked Blog Post.

**COMMENTS ROUTE (LOGIN REQUIRED)**
- `POST /blog/addComment/:id` : Add Comment on a Blog Post.
- `PUT /blog/removeComment/:id` : Remove Comment from a Blog Post.

## API Documentation
- **Request - Response**
  [Read Docs](https://docs.google.com/document/d/1mVF_syyMn2uXsXeGTygyzUGr4nrh5jqIVnBw7ThfB3M/edit?usp=drive_link)

## Software & Tools
- Node
- Git & Github
- Postman
- Thunder Client

### Clone This Repository
```bash
git clone https://github.com/Bishal-5/Blog-App.git
```
## Thank You!