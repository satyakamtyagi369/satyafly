const express = require('express');
const path = require('path');
const isAuthenticated  = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
});

router.get('/dashboard/chatbot', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/chatbot.html'));
});

module.exports = router;
