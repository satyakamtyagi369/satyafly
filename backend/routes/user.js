const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.get('/user', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            name: user.name,
            email: user.email,
            password: user.password, 
        });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
