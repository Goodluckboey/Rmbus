const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    botName: { type: String, required: true },
    hash: { type: String, required: true },
    requests: [String],
    morality: { type: Number },
  },
  { timestamps: true },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);
// "User" will create the users group in Mongo. e.g changing it to "Thing" will create things

module.exports = User;
