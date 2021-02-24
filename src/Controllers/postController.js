const createErr = require("http-errors");
const { ObjectId } = require("mongodb");
const { Post } = require("../../models/posts");
const authController = require("./authController");

// Get all posts (unprotected endpoint)
exports.index = async function (req, res) {
  res.send(await Post.find());
};

// Get posts based on username (unprotected endpoint)
exports.userPosts = async function (req, res, next) {
  const posts = await Post.find({
    username: req.params.username.toLowerCase(),
  });
  if (!posts.length) {
    return next(
      createErr(404, `No posts found with username ${req.params.username}`)
    );
  }
  res.send(posts);
};

// Get a single post based on post id (unprotected endpoint)
exports.singlePost = async function (req, res, next) {
  const post = await Post.findById({ _id: ObjectId(req.params.id) });
  console.log(post);
  if (!post) {
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send(post);
};

// Add new post (protected endpoint)
exports.add = async function (req, res, next) {
  const user = await authController.tokenCheck(req, res, next);
  if (req.body.username !== user.username) {
    return next(createErr(403, "Username mismatch"));
  }
  if (
    !req.body.username ||
    !req.body.postText ||
    !req.body.likes ||
    !req.body.imageUrl ||
    !req.body.postTitle ||
    !req.body.timestamp ||
    !req.body.tags
  ) {
    return next(createErr(400, "Required post information missing"));
  }
  const post = new Post(req.body);
  await post.save();
  res.send({ message: "New post added" });
};

// Update exisitng post (protected endpoint)
exports.update = async function (req, res, next) {
  authController.tokenCheck(req, res, next);
  if (req.params.id.length !== 24) {
    return next(createErr(400, "Id should be 24 bytes"));
  }
  // So that user can not update username or origianl time stamp.
  // Add a new timestamp
  const post = await Post.findByIdAndUpdate(
    { _id: ObjectId(req.params.id) },
    req.body
  );
  if (!post) {
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send({ message: "Post updated" });
};

// Delete a post (protected endpoint)
exports.delete = async function (req, res, next) {
  authController.tokenCheck(req, res, next);
  if (req.params.id.length !== 24) {
    return next(createErr(400, "Id should be 24 bytes"));
  }
  const post = await Post.deleteOne({ _id: ObjectId(req.params.id) });
  if (!post.deletedCount) {
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send({ message: "Post deleted" });
};

// ADD catches where a failure will crash the api server
