const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    likes: {type: Number, required: true, default: 0},
    dateAdded: { type: Date, default: Date.now},
    text: {type: String, required: true, minlength: 1, maxlength: 300}
});

const Post = mongoose.model("Post", postSchema)

function validatePost(post) {
	const schema = Joi.object({
		text: Joi.string().required().min(1).max(300)
	});
	return schema.validate(post);
}


exports.validatePost = validatePost;
exports.Post = Post;
exports.postSchema = postSchema;