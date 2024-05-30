const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 8 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  status: { type: String, default: "" },
  favorites: { type: String, default: "" },
  vision: { type: String, default: "" },
  contact: { type: String, default: "" },
  faqs: [faqSchema],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
