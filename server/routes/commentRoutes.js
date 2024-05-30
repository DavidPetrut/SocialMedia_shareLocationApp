const express = require("express");
const router = express.Router();
const Comment = require("../database/Comment");
const Post = require("../database/Post");
const authenticateToken = require("./authenticateToken");

// Get all comments for a specific post
router.get("/posts/:postId/comments", authenticateToken, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate(
      "author",
      "username profilePicture"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// Add a comment to a post
router.post("/posts/:postId/comments", authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content cannot be empty" });
  }
  try {
    const post = await Post.findById(req.params.postId);
    console.log("Found post:", post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: req.params.postId,
    });

    await comment.save();

    // Populate the author field before sending the response
    await comment.populate("author", "username profilePicture");

    // Update the post with the new comment
    post.comments.push(comment._id);
    await post.save(); // Make sure to save the post after modifying it

    // Ensure you return the populated comment
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// Delete a comment
router.delete("/comments/:id", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or user not authorized" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

// Update a comment
router.put("/comments/:id", authenticateToken, async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { content },
      { new: true }
    ).populate("author", "username profilePicture");
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or not authorized" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
});

module.exports = router;
