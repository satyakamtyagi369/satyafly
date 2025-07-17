const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASSWORD,
    },
});
async function sendBookingEmail(toEmail, passengerName,flight){
   const mailOptions = {
    from: `"CelebalFly" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "🎫 Your Flight Booking Confirmation - CelebalFly",
    html: `
      <h2>Hi ${passengerName},</h2>
      <p>Thank you for booking with CelebalFly!</p>
      <h3>🛫 Flight Details:</h3>
      <ul>
        <li><b>From:</b> ${flight.origin}</li>
        <li><b>To:</b> ${flight.destination}</li>
        <li><b>Airline:</b> ${flight.airline}</li>
        <li><b>Departure:</b> ${new Date(flight.departure_time).toLocaleString()}</li>
        <li><b>Arrival:</b> ${new Date(flight.arrival_time).toLocaleString()}</li>
        <li><b>Price:</b> $${flight.price}</li>
      </ul>
      <p>✈️ Safe travels!<br>Team CelebalFly</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}
module.exports = sendBookingEmail;