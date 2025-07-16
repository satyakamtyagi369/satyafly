const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Flight = require('../models/flight');
router.post('/confirm-booking', async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const numberOfPeople = passengers.length;
    const totalAmount = numberOfPeople * flight.price;

    const booking = new Booking({
      flightId,
      passengers,
      numberOfPeople,
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ error: 'Failed to confirm booking', details: error.message });
  }
});

module.exports = router;
