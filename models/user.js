const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const { postSchema } = require("../models/post");
const config = require("config");
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 4, maxlength: 30},
    email: {type: String, required: true, minlength: 1, maxlength: 30},
    password: {type: String, required: true, minlength: 4, maxlength: 70},
    post: [{ type: postSchema, default: [] }],
    profileImage: {type: String, default:`no photo`},
    aboutMe: {type: String,default: `I like Soccer`, minlength: 10, maxlength: 100},
    listFriends: {type: [String], default: []},
    pendingRequests: {type: [String], default: []},
    isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin  }, config.get('jwtSecret'));
};

const User = mongoose.model("User", userSchema)

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(4).max(30).required(),
		email: Joi.string().min(1).max(30).required(),
        password: Joi.string().min(4).max(70).required(),
	});
	return schema.validate(user);
}

exports.validateUser = validateUser;
exports.User = User;
exports.userSchema = userSchema;