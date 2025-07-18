require('dotenv').config();
// is file me Amadeus API ke liye configuration set karenge
// Amadeus API client ko import karenge aur use karne ke liye configure karenge
// Amadeus API ke liye clientId aur clientSecret ko .env file se lete hain
// iske liye hum Amadeus package ka use karenge, node i amadeus package install karna padega
const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
module.exports=amadeus;