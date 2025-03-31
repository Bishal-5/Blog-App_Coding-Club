import mongoose from "mongoose";
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    timestamp: {
        type: Date,
        default: new Date(),
    },

    likedBy: [{
        type: String,
    }],

    likes: {
        type: Number,
        default: 0,
    },

    comments: [{
        user : {
            type: String,
            required: true,
        },
        text : {
            type: String,
            required: true,
        },
        timestamp : {
            type: Date,
            default: new Date(),
        },
    }],
})

const Blog = mongoose.model('Blog', BlogSchema)

export default Blog;