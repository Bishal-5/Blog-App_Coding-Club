import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
    },

    bio: {
        type: String,
    },

    blogsCreated: [{
        type: String,
        ref: 'Blog',
        default: '',
    }],

    likedBlogs: [{
        type: String,
        ref: 'Blog',
        default: '',
    }],
})



const User = mongoose.model('User', UserSchema)

export default User;