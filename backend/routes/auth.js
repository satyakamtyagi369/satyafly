const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT_SECRET from .env (not hardcoded ideally)
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.redirect('/signup?error=exists');
        await User.create({ name, email, password });
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.redirect('/signup?error=server');
    }
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name, password });
    if (!user) return res.redirect('/signup?error=invalid');

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// ✅ EXPORT ONLY THIS:
module.exports = router;
