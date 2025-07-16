const express = require('express');
const router = express.Router();
const { handleUserInput, confirmBooking } = require('../controllers/conversationController');

router.post('/conversation', handleUserInput);
router.post('/book', confirmBooking);

module.exports = router;
