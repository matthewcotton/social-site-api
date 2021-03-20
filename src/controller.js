const express = require("express");
const router = express.Router();

const authService = require("./Services/authService");
const postService = require("./Services/postService");
const userService = require("./Services/usersService");

// /* Authentication */
router.post("/auth", authService.auth);

/* Define CRUD operations for users */
// Get logged in user
router.get("/user/:username", userService.singleUser);
// Create a new user
router.post("/user/add", userService.add);
// Update logged in user
router.put("/user/:username", userService.update);
// Delete logged in user
router.delete("/user/:username", userService.delete);

/* Define CRUD operations for posts */
// Get all posts
router.get("/posts", postService.index);
// Get posts based on username
router.get("/posts/user/:username", postService.userPosts);
// Get a single post based on id
router.get("/posts/id/:id", postService.singlePost);
// Add like from a post
router.patch("/posts/like/:id", postService.addLike);
// Remove like from a post
router.patch("/posts/unlike/:id", postService.removeLike);
// Create new post
router.post("/posts/add", postService.add);
// Update exisitng post
router.put("/posts/:id", postService.update);
// Delete a post
router.delete("/posts/:id", postService.delete);

// ADD Error handling for invalid route

module.exports = router;
