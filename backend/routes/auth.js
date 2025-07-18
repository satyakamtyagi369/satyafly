const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// JWT_SECRET from .env file se import karenge.
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.redirect('/signup?error=exists');
        const hashedpassword=await bcrypt.hash(password,10);// 10 is the salt round.
        // salt round ka matlab hai, yeh 10 times data ko encrypt karega. 
        // password secure toh hoga per yeh server ke response ko slow performance bhi dega.
        await User.create({ name, email, password:hashedpassword});
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup?error=server');
    }
});

router.post('/login', async (req, res) => {
    const {name,password} = req.body;
    const user = await User.findOne({ name});
    if (!user) return res.redirect('/signup?error=invalid');
    const kya_password_match_hai=await bcrypt.compare(password,user.password);
    if(!kya_password_match_hai){
        return res.redirect('/login?error=invalid');
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    //yeh sirf 1 hour ke liye he kaam karega according to the token verification which is working on authmiddleware.js file.
    // vaha se token verify hokar aayega.
    //aisa karne se mera koi data ko breach nahi karpayega.. 
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;
