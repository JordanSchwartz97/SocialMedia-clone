const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { Post, validatePost } = require("../models/post");

//GET Return all user data  /collections/api/user Kevin


//GET Returns all posts 	 /collections/api/posts Kevin


//POST Create a user 	/collections/api/register
router.post("/register", async (req, res) => {
    try{
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne ({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');
        
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save();
        return res.send({_id: user._id, name: user.name, email: user.email});
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//POST Add a friend to currently logged in user	 /collections/api/user/friendrequest/ Jordan


//POST Create about me profile /collections/api/user/createProfile Jordan


//POST Create a post /collections/api/user/newPost Jordan


//PUT edit profile of currently logged in user	/collections/api/user/profile Giancarlo


//DELETE Delete currently logged in user account /collections/api/delete/user Giancarlo


//DELETE Deletes a currently logged in user's posts /collections/api/delete/post Giancarlo


module.exports = router;