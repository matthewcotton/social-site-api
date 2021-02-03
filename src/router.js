const express = require("express");
const router = express.Router();

const userController = require("./Controllers/usersController");
const postController = require("./Controllers/postController");

// /* Auth */
router.post("/auth", userController.auth);

/* Define CRUD operations for posts */
// Get all posts
router.get("/posts", postController.index);
// Get posts based on username
router.get("/posts/user/:username", postController.userPosts);
// Get a single post based on id
router.get("/posts/id/:id", postController.singlePost);
// Add new post
router.post("/posts/add", postController.add);
// Update exisitng post
router.put("/posts/:id", postController.update);
// Delete a post
router.delete("/posts/:id", postController.delete);

// ADD Error handling for invalid route

module.exports = router;
