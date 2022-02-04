const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("DB connected.");
  } catch (err) {
    console.log("DB connection failed.", err.message);
  }
};

module.exports = connectDB;
