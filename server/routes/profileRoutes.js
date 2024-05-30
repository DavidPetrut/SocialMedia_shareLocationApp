const express = require("express");
const router = express.Router();
const User = require("../database/Users"); // Ensure this path is correct
const authenticateToken = require("./authenticateToken"); // Ensure this middleware is correctly implemented
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup for file uploads
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).single("image");

// Fetch user profile
router.get("/:username", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      status: user.status,
      favorites: user.favorites,
      vision: user.vision,
      contact: user.contact,
      faqs: user.faqs,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/upload/:username", upload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file selected!" });
  }
  const newImagePath = `/uploads/${req.file.filename}`;
  console.log(
    "This is the newImagePath before updating mongodb: ",
    newImagePath
  );
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: { profilePicture: newImagePath } },
      { new: true }
    );

    console.log("this is user after User.findOneAndUpdate: ", user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({
      message: "File uploaded and profile updated!",
      filePath: newImagePath,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database operation failed." });
  }
});

module.exports = router;
