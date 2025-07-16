const express = require('express');
const router = express.Router();
const { handleUserInput, confirmBooking } = require('../controllers/conversationController');
router.post('/conversation', handleUserInput);
router.post('/confirm-booking', confirmBooking);
module.exports = router;
