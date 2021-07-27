const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { Post, validatePost } = require("../models/post");
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


//GET Return all user data *WORKING*

router.get("/allUsers", async (req, res) =>{
    try{
        const user = await User.find();
        return res.send(user);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    
})

//GET Returns specific user data *WORKING*
router.get("/user/:userId",  async (req, res) =>{
    try {
        const user = await User.findById(req.params.userId);
        return res.send(user);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})


//GET Returns all posts *WORKING*	 
router.get("/allPosts",  async (req,res)=>{ 
    try{
        const post = await Post.find();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//POST Create a user *WORKING*
router.post("/register", async (req, res) => {
    try{
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne ({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');
        
        const salt = await bcrypt.genSalt(10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });
        await user.save();

        const token = user.generateAuthToken();
             return res
             .header('x-auth-token', token)
             .header('access-control-expose-headers', 'x-auth-token')
             .send({ _id: user._id, name: user.name, email: user.email });
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// POST request to login an existing user

router.post("/login", auth, async (req, res) => {
    /*try{
        // let user = await User.findById(req.user._id);
        //let passwordHash = user.password;
        //const salt = await bcrypt.genSalt(10);
        
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        });
        await user.save();

        const token = user.generateAuthToken();
             return res
             .header('x-auth-token', token)
             .header('access-control-expose-headers', 'x-auth-token')
             .send({ _id: user._id, name: user.name, email: user.email });
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }*/
});

// PUT Add a user as an admin *WORKING*
router.put("/allUsers/changePrivileges",  async (req, res) =>{
    try {
        let user = await User.findOne ({ email: req.body.email });
        if (!user) return res.status(400).send('User does not exist.');

        user.isAdmin = req.body.isAdmin;
        await user.save();
        return res.send(user)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

/* PUT Add a friend to currently logged in user	*OLD* 
router.put("/user/friends/:userId/:friendId", [auth,admin], async (req,res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send('User does not exist.');
        const friend = await User.findById(req.params.friendId);
        if (!friend) return res.status(400).send('User does not exist.');

        user.listFriends.push(req.params.friendId)

        await user.save();
        return res.send('Friend has been added to friendlist.')
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }});
*/

// PUT Add a friend to currently logged in user	*WORKING* 
router.put("/user/addFriends/:email", auth, async (req,res) => {
    try {
        //id = token.getItem(_id)
       // const user = await User.findById(req.params.userId);
       // if (!user) return res.status(400).send('User does not exist.');
        let user = await User.findById(req.user._id);
        //dont need to verify since it did that on the auth

        let friend = await  User.findOne ({ email: req.params.email });
        if (!friend) return res.status(400).send('User does not exist.');
        //ask how to reference currently logged in user. 
        //res.send(req.user._id);

        user.listFriends.push(friend._id)

        await user.save();

        
        return res.send('Friend has been added to friendlist.')
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }});

//POST Create a post *WORKING*
    router.post("/user/newPost", auth, async (req, res) => {
    try {
        let user = await User.findOne ({ email: req.body.email});
        if (!user) return res.status(400).send(`User does not exist.`)
        //* ASK ABOUT VALIDATION IT WAS BREAKING OUR PUT REQUESTS SAYING THAT EMAIL WASN'T ALLOWED*
        // const {error} = validatePost(req.body);
        // if (error) return res.status(400).send(error);

        
        const post = new Post({
            text: req.body.text,
        });
        user.post.push(post)
        await user.save();
        return res.send(user.post);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }});

// PUT Create about me profile *WORKING*
    router.put("/allUsers/createProfile", auth,  async (req, res) =>{
        try {
            let user = await User.findOne ({ email: req.body.email });
            if (!user) return res.status(400).send('User does not exist.');

            user.aboutMe = req.body.aboutMe;

            await user.save();
            return res.send(user)
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }});

//DELETE Delete currently logged in user account *WORKING*
router.delete('/user/:id/deleteAccount', auth, async (req, res) => {    
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user)
            return res.status(400).send(`The user with email "${req.params.email}" does not exist.`);
        return res.send(user);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });


//DELETE Deletes a currently logged in user's posts *WORKING*
router.delete('/user/posts/:postId/deletePost', auth, async (req, res) => {    
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