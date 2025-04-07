import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: 'No Profile Picture',
    },

    bio: {
        type: String,
        default: '',
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

    followers: {
        type: Number,
        default: 0,
    },

    following: {
        type: Number,
        default: 0,
    },

    followersList: [{
        type: String,
        ref: 'User',
    }],

    followingList: [{
        type: String,
        ref: 'User',
    }]
})



const User = mongoose.model('User', UserSchema)

export default User;