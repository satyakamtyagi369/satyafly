const axios = require('axios');
const Flight = require('../models/flight');
const Booking = require('../models/booking');
const UserQuery = require('../models/query');

// user prompt ke liye kuch formats define kiye hain.
// ye formats user ko guide karne ke liye hain ki unhe kaise input den
const formats = {
  initial: "book a flight from {origin} to {destination} on {date}",
  withPeople: "book a flight from {origin} to {destination} on {date} for {number} adults",
  budget: "flights from {origin} to {destination} on {date} under {budget}"
};

// abveriviations for cites kyko api me pura naam nahi chalta hai.
// isliye humne yaha pe cities ke IATA codes define kiye hain.
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

// city ka nama uppercase me ho to voh lowercase me convert kar ke IATA code return karega.
// agar city ka naam nahi mila to null return karega.
function getIATACode(city) {
  return cityToIATACode[city.trim().toLowerCase()] || null;
}

// yeh user ke input message ko handle karega.
// yeh function user ke input ko process karega aur response generate karega.
exports.handleUserInput = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;

    await UserQuery.create({
      sessionId,
      conversation: [{ role: 'user', message: userMessage }]
    });

    let response = {};
    const lower = userMessage.toLowerCase();

    // yeh conversation language understand CLU ki madad se user ke input ko process karega.
    // uski madad se hum alag-alag queries ko handle kar sakte hain.
    // source, destination, date, aur number of adults ko amadeus API se fetch karne ke liye use karenge.
    const matchWithPeople = userMessage.match(/book a flight from (.+) to (.+) on (.+) for (\d+) adults/i);
    if (matchWithPeople) {
      const [, origin, destination, date, number] = matchWithPeople;
      const originCode = getIATACode(origin);
      const destinationCode = getIATACode(destination);

      if (!originCode || !destinationCode) {
        // uper jo cities de rakhi hai sirf vahi cities ke naam chalega.
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

          // database me flights save karne ke liye, agar flights already exist nahi hai to save karega.
          // agar flights already exist hai to save nahi karega.
          // isse database me duplicate entries nahi hongi.
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

    // kisiko budget ke hisaab se flights chahiye to uske liye alag se handle karega.
    // budget ke hisaab se flights ko filter karega.
    else if (lower.includes('under ₹')) {
      const match = userMessage.match(/flights from (.+) to (.+) on (.+) under (\d+)/i);
      if (match) {
        const [, origin, destination, date, budget] = match;

        const flights = await Flight.find({
          origin: { $regex: new RegExp(origin, 'i') },
          destination: { $regex: new RegExp(destination, 'i') },
          departure_time: {
            $gte: new Date(date),
            $lte: new Date(date + 'T23:59:59')
          },
          price: { $lte: parseFloat(budget) } // budget ko Float me convert karega
        });

        response.serverMessage = `Flights under ₹${budget} for ${origin} → ${destination} on ${date}`;
        response.flights = flights;
      } else {
        response.serverMessage = `Please use format: ${formats.budget}`;
      }
    }

    // kisi ne sirf flight book karne ke liye kaha hai to uske liye alag se handle karega.

    else if (lower.includes('book a flight from')) {
      const match = userMessage.match(/book a flight from (.+) to (.+) on (.+)/i);
      if (match) {
        const [, origin, destination, date] = match;
        response.serverMessage = `How many people are flying? Use format: ${formats.withPeople}`;
        // kitne log flight book kar rahe hain, uska context set karega.
        response.context = { origin, destination, date };
      } else {
        response.serverMessage = `Please use format: ${formats.initial}`;
      }
    }

    // agar user ne promt me kuch aur diya hai to uske liye alag se handle karega.
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

// booking confirm karne ke liye function.
// yeh function user ke booking request ko handle karega.
exports.confirmBooking = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    // booking ke liye flightId aur passengers ki list chahiye hoti hai.
    // agar flightId ya passengers ki list nahi hai to error return karega.
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
