const express = require("express");
const router = express.Router();

const userController = require("./Controllers/usersController");
const postController = require("./Controllers/postController");

// const { ObjectId } = require("mongodb"); // is this needed?
// const mongoose = require("mongoose"); // is this needed?

// const { User } = require("../models/users"); // is this needed?
// const { Posts } = require("../models/posts"); // is this needed?

// /* Auth */
// router.post("/auth", async (req, res) => {
//   const user = await User
// })

// Define CRUD operations for posts
// Get all posts
router.get("/posts/", postController.index);
// Get posts based on username
router.get("/posts/:username", postController.userPosts);
// Add new post
router.post("/posts/add", postController.add);
// Update exisitng post
router.put("/posts/:id", postController.update);
// Delete a post
router.delete("/posts/:id", postController.delete);

// ADD Error handling for invalid route

module.exports = router;
