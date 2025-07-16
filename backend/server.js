require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

const connectDB=require('./db');
const chatbotRoute = require('./routes/chatbot');
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");
const flightRoutes= require('./routes/flight');
const flightSearchRoutes=require('./routes/flightSearch');

const conversationroutes=require('./routes/conversationRoutes');
const confirmBookingrequest = require('./routes/confirmBooking');
console.log("authRoutes:", typeof authRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("userRoutes:", typeof userRoutes);
const app = express();
const port = 3000;

mongoose.connect((process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/dashboard',chatbotRoute);
app.use('/api',conversationroutes);

// Basic routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

// Modular routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(userRoutes);
app.use(flightRoutes);
app.use(flightSearchRoutes);
app.use(confirmBookingrequest);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
