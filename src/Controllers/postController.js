const createErr = require("http-errors");

const { ObjectId } = require("mongodb"); // is this needed?
// const mongoose = require("mongoose"); // is this needed?

const { User } = require("../models/users"); // is this needed?
const { Post } = require("../models/posts"); // is this needed?

// Get all posts
exports.index = async function (req, res) {
  res.send(await Post.find());
};

// Get posts based on username
exports.userPosts = async function (req, res, next) {
  const posts = await Post.find({ username: req.params.username });
  if (!posts.length) {
    // confirm that an empty object isn't returned from find function
    return next(
      createErr(404, `No posts found with username ${req.params.username}`)
    );
  }
  res.send(posts);
};

// Add new post
exports.add = async function (req, res, next) {
  // ADD Check that all required content is included in the body
  const post = new Post(req.body);
  await post.save();
  res.send({ message: "New post added" });
};

// Update exisitng post
exports.update = async function (req, res, next) {
  // ADD Checks if required
  await Post.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Post updated" });
};

// Delete a post
exports.delete = async function (req, res, next) {
  await Post.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Post deleted" });
};

// Where is ObjectId added to new posts???
