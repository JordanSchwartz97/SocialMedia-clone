const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 4, maxlength: 30},
    email: {type: String, required: true, minlength: 1, maxlength: 30},
    password: {type: String, required: true, minlength: 4, maxlength: 20},
    post: { type: [postSchema], default: [] },
    profileImage: {type: String, default:`no photo`},
    aboutMe: {type: String,default: `I like Soccer`, minlength: 10, maxlength: 100},
    listFriends: {type: [String]},
    pendingRequests: {type: [String]}
});

const User = mongoose.model("User", userSchema)

exports.User = User;
exports.UserSchema = UserSchema;