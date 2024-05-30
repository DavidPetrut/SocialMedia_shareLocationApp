const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  like: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: undefined },
  ],
  dislike: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: undefined },
  ],
  report: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: undefined },
  ],
});

const Reaction = mongoose.model("Reaction", reactionSchema);
module.exports = Reaction;
