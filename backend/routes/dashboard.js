const express = require('express');
const path = require('path');
const isAuthenticated  = require('../middleware/authMiddleware');
// dashboard route banayenge
// yeh check karega ki user authenticated hai ya nahi
// agar authenticated hai toh dashboard page dikhayega
// agar authenticated nahi hai toh login page pe redirect karega
// iske liye hum authMiddleware ka use karenge jo JWT token ko verify karega
const router = express.Router();

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/dashboard.html'));
});

router.get('/dashboard/chatbot', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/public/chatbot.html'));
});

module.exports = router;
