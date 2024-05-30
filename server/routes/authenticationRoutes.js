const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../database/Users");
const jwt = require("jsonwebtoken");

// Sign up new user
router.post("/signup", async (req, res) => {
  try {
    // Check if user or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with the same username or email already exists",
      });
    }

    // Validate password
    if (
      !req.body.password ||
      req.body.password.length < 8 ||
      !/\d/.test(req.body.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(req.body.password)
    ) {
      return res
        .status(400)
        .json({ message: "Password does not meet complexity requirements" });
    }

    if (req.body.password !== req.body.repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Signup Error: ", error);
    res.status(500).json({ message: "Error registering new user" });
  }
});

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send("Cannot find user");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = generateToken(user);
      res.json({ token: token, username: user.username, _id: user._id });
    } else {
      res.status(401).send("Not allowed");
    }
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
