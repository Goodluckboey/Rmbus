const express = require("express");
const connectDB = require("./models/db");
const cors = require("cors");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const sanitize = require("mongo-sanitize");
const mongoUri = "mongodb://127.0.0.1:27017/rmbus";
require("dotenv").config(); 
connectDB(mongoUri);

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Might have to rearrange this segment if code can't work
const PORT = process.env.PORT || 5000
app.listen(process.env.PORT, () => {
  console.log(`Server started on port `);
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>

// Create New User
app.post("/registration", async (req, res) => {
  const { hash } = sanitize(req.body);
  try {
    const hashed = await bcrypt.hash(hash, 12);
    const user = new User({ ...req.body, hash: hashed });
    await user.save();
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

// add a userRequest
app.put("/main/:userid/", async (req, res) => {
  const userRequest = JSON.stringify(req.body).replace(/[^\w\s]/gi, "");
  if (userRequest != "") {
    console.log("userRequest is not blank");
    try {
      const newRequest = await User.findOneAndUpdate(
        { _id: req.params.userid },
        { $push: { requests: userRequest } },
        {
          upsert: true,
        }
      );
      res.json(newRequest);
      console.log("it works here");
    } catch (err) {
      // console.log(err);
      res.json(err);
    }
  } else {
    console.log("userRequest is blank");
  }
});

// DELETE all of user's Requests
app.delete("/deleteRequests/:userid/", async (req, res) => {
  try {
    const deleteRequests = await User.findOneAndUpdate(
      { _id: req.params.userid },
      { $set: { requests: [""] } }
      // {
      //   upsert: true,
      // }
    );
    res.json(deleteRequests);
    console.log("Deleted");
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//Display All Requests
app.get("/requests/:userid", async (req, res) => {
  try {
    const userData = await User.find({
      _id: req.params.userid,
    });
    res.json(userData);
  } catch (err) {
    res.json(err);
  }
});

//Display Account botName
app.get("/profile/:userid", async (req, res) => {
  try {
    const userRequests = await User.find({
      _id: req.params.userid,
    });
    console.log(userRequests);
    res.json(userRequests);
  } catch (err) {
    res.json(err);
  }
});

// find user by username, then compare hash to authenticate
app.post("/login", async (req, res) => {
  const { userName, hash } = sanitize(req.body);
  let valid = false;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      res.json({ valid });
      return;
    }
    valid = await bcrypt.compare(hash, user.hash);
    if (valid) {
      res.json({ valid, user });
      console.log("valid");
    } else {
      res.json({ valid, msg: "wrong password" });
      console.log("not valid");
    }
  } catch (err) {
    console.log(err);
    res.json({ valid, msg: "authentication failed due to err: " + err });
  }
});
