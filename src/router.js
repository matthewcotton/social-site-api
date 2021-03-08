const express = require("express");
const router = express.Router();

const authController = require("./Controllers/authController");
const postController = require("./Controllers/postController");
const userController = require("./Controllers/usersController");

// /* Authentication */
router.post("/auth", authController.auth);

/* Define CRUD operations for users */
// Get logged in user
router.get("/user/:username", userController.singleUser);
// Create a new user
router.post("/user/add", userController.add);
// Update logged in user
router.put("/user/:username", userController.update);
// Delete logged in user
router.delete("/user/:username", userController.delete);

/* Define CRUD operations for posts */
// Get all posts
router.get("/posts/:limit/:skip", postController.index);
// Get posts based on username
router.get("/posts/user/:username", postController.userPosts);
// Get a single post based on id
router.get("/posts/id/:id", postController.singlePost);
// Add like from a post
router.patch("/posts/like/:id", postController.addLike);
// Remove like from a post
router.patch("/posts/unlike/:id", postController.removeLike);
// Create new post
router.post("/posts/add", postController.add);
// Update exisitng post
router.put("/posts/:id", postController.update);
// Delete a post
router.delete("/posts/:id", postController.delete);

// ADD Error handling for invalid route

module.exports = router;
