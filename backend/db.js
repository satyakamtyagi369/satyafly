const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
// is file me hum MongoDB ke saath connection establish karenge
// mongoose ko use karke MongoDB se connect karenge
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected via db.js");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
