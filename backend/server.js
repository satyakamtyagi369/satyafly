require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");
console.log("authRoutes:", typeof authRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("userRoutes:", typeof userRoutes);
const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/celebalFly", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/public')));

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
