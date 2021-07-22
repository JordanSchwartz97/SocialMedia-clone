const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    likes: {type: Number, required: true, default: 0},
    dateAdded: { type: Date, default: Date.now},
    Post: {type: String, required: true }
});

const Post = mongoose.model("Post", postSchema)

exports.Post = Post;
exports.postSchema = postSchema;