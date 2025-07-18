const express = require('express');
const router = express.Router();
// conversation routes banayenge
// yeh routes user ke input ko handle karenge aur booking confirm karne ka kaam karenge
const { handleUserInput, confirmBooking } = require('../controllers/conversationController');
router.post('/conversation', handleUserInput);
router.post('/confirm-booking', confirmBooking);
module.exports = router;
