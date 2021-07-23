const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { Post, validatePost } = require("../models/post");

//GET Return all user data  /collections/api/user Kevin

router.get("/allUsers", async (req, res) =>{
    try{
        const user = await User.find();
        return res.send(user);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    
})


//GET Returns all posts 	 /collections/api/posts Kevin

router.get("/allPosts" , async (req,res)=>{ 
    try{
        const post = await Post.find();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

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

//POST Add a friend to currently logged in user	 user/friendrequest Jordan
// router.post("/user/friendrequest"), async (req,res) => {
//     try {
//        const { error } = validateUser(req.body);
//        if (error) return res.status(400).send(error);
//        const 
//     }
// }
//POST Create a post /collections/api/user/newPost Jordan



//PUT Create about me profile /collections/api/user/createProfile Jordan
    router.put("/allUsers/createProfile", async (req, res) =>{
        try {
            
            // if (error) return res.status(400).send(error);

            let user = await User.findOne ({ email: req.body.email });
            if (!user) return res.status(400).send('User not registered.');

            user.aboutMe = req.body.aboutMe;

            await user.save();
            return res.send(user)
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    })




//PUT edit profile of currently logged in user	/collections/api/user/profile Giancarlo


//DELETE Delete currently logged in user account /collections/api/delete/user Giancarlo
router.delete('/user/:id/deleteAccount', async (req, res) => {    
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user)
            return res.status(400).send(`The user with email "${req.params.email}" does not exist.`);
        return res.send(user);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });


//DELETE Deletes a currently logged in user's posts /collections/api/delete/post Giancarlo
router.delete('/user/posts/:postId/deletePost', async (req, res) => {    
    try {
        const post = await Post.findByIdAndRemove(req.params.postId);
        if (!post)
            return res.status(400).send(`The user with email "${req.params.postId}" does not exist.`);
        return res.send(post);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });



module.exports = router;