const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { User } = require("./Controllers/usersController");
const posts = require("./Controllers/postController");

// /* Auth */
// router.post("/auth", async (req, res) => {
//   const user = await User
// })


// Error handling for invalid route

module.exports = router;