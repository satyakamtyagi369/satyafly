const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Flight = require('../models/flight');
const sendBookingEmail = require('../utils/emailService'); // Email service for sending booking confirmation emails
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
    const ticketId = "TKT" + Math.floor(Math.random() * 900000 + 100000); // Random 6-digit ticket ID
    // ticketId generate karne ke liye random number use karenge
    // Booking object create karenge
    const booking = new Booking({
      flightId,
      passengers,
      numberOfPeople,
      totalAmount,
      status: 'confirmed',
      ticketId
    });

    await booking.save();

    // booking confirmation email bhejne ke liye
    // passengers ke email aur name se booking confirmation email bhejenge
    for (const passenger of passengers) {
      await sendBookingEmail(passenger.email, passenger.name, flight);
    }

    // ticket object create karenge
    // ticket object me ticketId, flight details aur passengers details include karenge
    const ticket = {
      ticketId,
      flight: {
        origin: flight.origin,
        destination: flight.destination,
        airline: flight.airline,
        departure: flight.departure_time,
        arrival: flight.arrival_time
      },
      passengers
    };

    res.status(201).json({
      message: 'Booking confirmed and emails sent successfully',
      ticket
    });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ error: 'Failed to confirm booking', details: error.message });
  }
});

module.exports = router;
