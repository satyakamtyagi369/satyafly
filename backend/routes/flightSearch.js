const express = require('express');
const router = express.Router();
const amadeus = require('../utils/amadeus'); // adjust path if needed
const Flight = require('../models/flight'); // import Flight model

/* Example URL:
   http://localhost:3000/search-flights?origin=DEL&destination=BOM&departureDate=2025-07-20
*/

// yeh route flights search karne ke liye hai
router.get('/search-flights', async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'Missing query parameters' });
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: 1,
      max: 5
    });

    const flights = await Promise.all(response.data.map(async (offer) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments.slice(-1)[0];
      // database me flight details ko save karne ke liye
      // yeh flight details ko Flight model me save karega
      const flightData = {
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        airline: firstSegment.carrierCode,
        departure_time: firstSegment.departure.at,
        arrival_time: lastSegment.arrival.at,
        price: parseFloat(offer.price.total)
      };
      // databse me save ke liye.
      const savedFlight = await Flight.create(flightData);
      return savedFlight;
    }));

    res.json(flights);
  } catch (error) {
    res.status(500).json({
      error: 'Amadeus API error',
      details: error.description || error.message
    });
  }
});

module.exports = router;
