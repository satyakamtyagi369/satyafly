const express = require("express");
const router = express.Router();
// chatbot route banayenge
// yeh route chatbot ke liye hoga jo user se message lega aur reply karega
router.post("/dashboard/chatbot", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ reply: "Please type a message." });
  }
  // yeh simple chatbot hai jo user ke message ka reply karega shuruaat me example ke liye liya gaya hai.
  let reply;
  if (message.toLowerCase().includes("hello")) {
    reply = "Hi there! How can I assist you today?";
  } else if (message.toLowerCase().includes("flight")) {
    reply = "Sure! I can help you search flights. Please tell me your departure and destination cities.";
  } else {
    reply = "I'm just a simple chatbot for now. But I'm learning more every day!";
  }

  res.json({ reply });
});

module.exports = router;
