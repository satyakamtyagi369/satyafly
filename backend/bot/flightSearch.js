const Amadeus = require("amadeus");
// Amadeus API client import karenge
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});
async function searchFlights(origin, destination, date, adults) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: adults,
      max: 5
    });
    return response.data;
  } catch (err) {
    console.error("Amadeus error:", err);
    return null;
  }
}
module.exports = { searchFlights };
