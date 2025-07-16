const axios = require('axios');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const UserQuery = require('../models/query');

// Format templates
const formats = {
  initial: "book a flight from {origin} to {destination} on {date}",
  withPeople: "book a flight from {origin} to {destination} on {date} for {number} adults",
  budget: "flights from {origin} to {destination} on {date} under ₹{budget}"
};

// Mapping of city names to IATA codes
const cityToIATACode = {
  delhi: "DEL",
  mumbai: "BOM",
  chandigarh: "IXC",
  jaipur: "JAI",
  kolkata: "CCU",
  bangalore: "BLR",
  hyderabad: "HYD",
  chennai: "MAA",
  goa: "GOI"
};

// Helper to get IATA code from city name
function getIATACode(city) {
  return cityToIATACode[city.trim().toLowerCase()] || null;
}

// Handle user message input
exports.handleUserInput = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;

    await UserQuery.create({
      sessionId,
      conversation: [{ role: 'user', message: userMessage }]
    });

    let response = {};
    const lower = userMessage.toLowerCase();

    // 1. Full format with number of people
    const matchWithPeople = userMessage.match(/book a flight from (.+) to (.+) on (.+) for (\d+) adults/i);
    if (matchWithPeople) {
      const [, origin, destination, date, number] = matchWithPeople;
      const originCode = getIATACode(origin);
      const destinationCode = getIATACode(destination);

      if (!originCode || !destinationCode) {
        response.serverMessage = "Invalid city name. Please use cities like Delhi, Mumbai, Chandigarh, etc.";
        return res.status(200).json(response);
      }

      try {
        const query = new URLSearchParams({
          origin: originCode,
          destination: destinationCode,
          departureDate: date
        });

        const amadeusRes = await axios.get(`http://localhost:3000/search-flights?${query.toString()}`);
        const flights = amadeusRes.data;

        if (flights.length === 0) {
          response.serverMessage = "No flights found on this day.";
        } else {
          response.serverMessage = `Here are available flights from ${origin} to ${destination} on ${date}.`;
          response.flights = flights;

          // Save new flights to DB if not already present
          for (const f of flights) {
            const exists = await Flight.findOne({
              origin: f.origin,
              destination: f.destination,
              departure_time: new Date(f.departure_time),
              airline: f.airline
            });

            if (!exists) {
              const flightDoc = new Flight(f);
              await flightDoc.save();
            }
          }
        }
      } catch (err) {
        console.error("Error calling Amadeus route:", err.message);
        response.serverMessage = "Failed to fetch flights from Amadeus API.";
      }
    }

    // 2. Budget query
    else if (lower.includes('under ₹')) {
      const match = userMessage.match(/from (.+) to (.+) on (.+) under ₹(\d+)/i);
      if (match) {
        const [, origin, destination, date, budget] = match;

        const flights = await Flight.find({
          origin: { $regex: new RegExp(origin, 'i') },
          destination: { $regex: new RegExp(destination, 'i') },
          departure_time: {
            $gte: new Date(date),
            $lte: new Date(date + 'T23:59:59')
          },
          price: { $lte: parseInt(budget) }  // ✅ FIXED
        });

        response.serverMessage = `Flights under ₹${budget} for ${origin} → ${destination} on ${date}`;
        response.flights = flights;
      } else {
        response.serverMessage = `Please use format: ${formats.budget}`;
      }
    }

    // 3. Prompt for number of adults
    else if (lower.includes('book a flight from')) {
      const match = userMessage.match(/book a flight from (.+) to (.+) on (.+)/i);
      if (match) {
        const [, origin, destination, date] = match;
        response.serverMessage = `How many people are flying? Use format: ${formats.withPeople}`;
        response.context = { origin, destination, date };
      } else {
        response.serverMessage = `Please use format: ${formats.initial}`;
      }
    }

    // 4. Fallback
    else {
      response.serverMessage = "Sorry, I didn’t understand that. Please follow the format.";
    }

    // Save bot's response to conversation
    await UserQuery.updateOne(
      { sessionId },
      { $push: { conversation: { role: 'server', message: response.serverMessage } } }
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in handleUserInput:", error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Confirm flight booking
exports.confirmBooking = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    // ✅ Sanity check to prevent undefined ID error
    if (!flightId || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: "Invalid booking data." });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    const totalAmount = passengers.length * flight.price;

    const booking = await Booking.create({
      flightId,
      passengers,
      numberOfPeople: passengers.length,
      totalAmount,
      status: 'confirmed'
    });

    return res.status(200).json({
      message: 'Your booking is successful!',
      bookingId: booking._id
    });
  } catch (error) {
    console.error("Error in confirmBooking:", error.message);
    return res.status(500).json({ error: 'Booking failed' });
  }
};
