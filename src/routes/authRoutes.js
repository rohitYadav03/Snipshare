const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/checkAuth");
const validator = require("validator")
require("dotenv").config();

const authRouter = express.Router();

//  SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (!validator.isStrongPassword(password)) {
  return res.status(400).json({ message: "Password is not strong enough" });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetails = new UserModel({ name, email, password: hashedPassword });
    await userDetails.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {

    if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  res.status(500).json({ message: "Something went wrong. Please try again." });
}


  
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter the details first" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days


    res.cookie("login", token, {
  httpOnly: true,
  sameSite: "None",
  secure: true,
  expires: expiryDate,
});

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: `ERROR in login: ${error.message}` });
  }
});

authRouter.post("/logout", authenticateToken, (req, res) => {
  try {
    res.clearCookie("login", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: `ERROR: ${error.message}` });
  }
});


module.exports = { authRouter };
