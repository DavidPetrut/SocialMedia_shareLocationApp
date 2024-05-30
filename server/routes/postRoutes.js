const express = require("express");
const router = express.Router();
const Post = require("../database/Post");
const authenticateToken = require("./authenticateToken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// upload a file starts here
const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // Ensure this path is relative to the root of your project where your server.js is located
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
// this was the upload file

const validatePostInput = (title, content) => {
  const titleWordCount = title.split(/\s+/).length;
  if (titleWordCount > 20) {
    throw new Error("Title cannot have more than 20 words.");
  }
};

// lastPostTime keeps track of the last post time per user
const lastPostTime = new Map();

// Make sure to include validation for mapImageUrl when creating a new post.
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, tags, location, mapImageUrl } = req.body;
      const parsedTags = JSON.parse(tags);
      validatePostInput(title, content);
      const image = req.file ? `/uploads/${req.file.filename}` : "";
      const authorId = req.user._id;
      const now = new Date();

      if (
        lastPostTime.has(authorId) &&
        now - lastPostTime.get(authorId) < 120000
      ) {
        return res
          .status(429)
          .json({ message: "You can only post once every 2 minutes." });
      }

      console.log(
        "this is mapImageUrl from postRoutes.js value: ",
        mapImageUrl
      );

      const post = new Post({
        title,
        content,
        tags: parsedTags,
        image,
        location,
        mapImageUrl,
        author: authorId,
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post", error });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username _id profilePicture")
      .populate("comments");

    // Calculate comment counts after population
    posts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: post.comments.length,
      createdAt: post.createdAt,
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Retrieve a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author")
      .populate("comments");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error });
  }
});

// Update a post
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { title, content, tags, location } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    validatePostInput(title, content);

    const updateData = {
      title,
      content,
      location,
      tags: parsedTags,
    };

    // If there's a new file, update the image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id, author: req.user._id },
        updateData,
        { new: true }
      );
      if (!post) {
        return res
          .status(404)
          .json({ message: "Post not found or user not authorized" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error updating post", error });
    }
  }
);

// Delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error });
  }
});

// POST route to handle reactions
router.post("/:id/react", authenticateToken, async (req, res) => {
  try {
    const { reactionType } = req.body;
    const post = await Post.findById(req.params.id).populate("reactions.user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure reactions is properly initialized as an array
    if (!Array.isArray(post.reactions)) {
      post.reactions = [];
    }

    // Filter out the existing reaction of the same type by the same user
    post.reactions = post.reactions.filter((reaction) => {
      return (
        (reaction.user &&
          reaction.user._id.toString() !== req.user._id.toString()) ||
        reaction.type !== reactionType
      );
    });

    // Check if the reaction was already present
    const existingReaction = post.reactions.find(
      (reaction) =>
        reaction.user &&
        reaction.user._id.toString() === req.user._id.toString() &&
        reaction.type === reactionType
    );

    if (!existingReaction) {
      // Add a new reaction if it wasn't found
      post.reactions.push({ user: req.user._id, type: reactionType });
    } else {
      // Remove the reaction if it was already present
      post.reactions = post.reactions.filter(
        (reaction) =>
          reaction.user._id.toString() !== req.user._id.toString() ||
          reaction.type !== reactionType
      );
    }

    await post.save();
    res.status(200).json({ reactions: post.reactions });
  } catch (error) {
    console.error("Error updating reactions:", error);
    res.status(500).json({ message: "Error updating reactions", error });
  }
});

module.exports = router;
