const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const Joi = require('joi');
const express = require('express');
const router = express.Router();


//POST validates login 
router.post('/', async (req, res) => {
    try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.')
    const token = jwt.sign({ _id: user._id, name: user.name }, config.get('jwtSecret'));
    return res.send(token); // send token instead of just "true"
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    });


function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(1).max(30).required().email(),
        password: Joi.string().min(4).max(70).required(),
    });
return schema.validate(req);
}
module.exports = router;