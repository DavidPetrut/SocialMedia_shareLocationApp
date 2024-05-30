const express = require("express");
const router = express.Router();
const Reaction = require("../database/Reaction");
const authenticateToken = require("./authenticateToken");

router.post("/:postId", authenticateToken, async (req, res) => {
  const { type } = req.body;
  const { postId } = req.params;
  const userId = req.user._id;

  if (!userId) {
    console.error("User ID is undefined");
    return res.status(400).json({ message: "User ID is undefined" });
  }

  try {
    const reaction = (await Reaction.findOne({ post: postId })) || {
      like: [],
      dislike: [],
      report: [],
    };
    const types = ["like", "dislike", "report"];
    let update = {};

    // Remove the userId from all reaction types
    types.forEach((t) => {
      if (reaction[t].includes(userId)) {
        update[`$pull`] = { [t]: userId };
      }
    });

    // Add the userId to the selected reaction type if it was not already there
    if (!reaction[type].includes(userId)) {
      update[`$addToSet`] = { [type]: userId };
    }

    const updatedReaction = await Reaction.findOneAndUpdate(
      { post: postId },
      update,
      { new: true, upsert: true }
    );

    res.json({
      likeCount: updatedReaction.like.length,
      dislikeCount: updatedReaction.dislike.length,
      reportCount: updatedReaction.report.length,
      userReaction: updatedReaction[type].includes(userId) ? type : null,
    });
  } catch (error) {
    console.error("Error processing reaction", error);
    res.status(500).json({ message: "Error processing reaction", error });
  }
});

router.get("/:postId", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const reactions = await Reaction.findOne({ post: postId });
    let userReaction = null;
    if (reactions) {
      if (reactions.like.includes(userId)) userReaction = "like";
      if (reactions.dislike.includes(userId)) userReaction = "dislike";
      if (reactions.report.includes(userId)) userReaction = "report";
    }

    res.json({
      likeCount: reactions ? reactions.like.length : 0,
      dislikeCount: reactions ? reactions.dislike.length : 0,
      reportCount: reactions ? reactions.report.length : 0,
      userReaction: userReaction,
    });
  } catch (error) {
    console.error("reactionRoutes: Error fetching reactions", error);
    res.status(500).json({ message: "Error fetching reactions", error });
  }
});

module.exports = router;
