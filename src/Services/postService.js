const createErr = require("http-errors");
const { ObjectId } = require("mongodb");
const { Post } = require("../../models/posts");
const authService = require("./authService");

// Get all posts (unprotected endpoint)
exports.index = async function (req, res) {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  res.send(await Post.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit));
};

// Get posts based on username (unprotected endpoint)
exports.userPosts = async function (req, res, next) {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const posts = await Post.find({
    username: req.params.username.toLowerCase(),
  })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
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
  const user = await authService.tokenCheck(req, res, next);
  if (req.body.username !== user.username) {
    return next(createErr(403, "Username mismatch"));
  }
  if (
    !req.body.username ||
    !req.body.postText ||
    !req.body.likes ||
    !req.body.imageData ||
    !req.body.postTitle ||
    !req.body.timestamp
  ) {
    return next(createErr(400, "Required post information missing"));
  }
  const post = new Post(req.body);
  await post.save();
  res.send({ message: "New post added" });
};

// Add like from a post (unprotected endpoint)
exports.addLike = async function (req, res, next) {
  if (req.params.id.length !== 24) {
    return next(createErr(400, "Id should be 24 bytes"));
  }
  const post = await Post.findByIdAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $inc: { likes: 1 } }
  );
  if (!post) {
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send({ message: "Like added" });
};

// Remove like from a post (unprotected endpoint)
exports.removeLike = async function (req, res, next) {
  if (req.params.id.length !== 24) {
    return next(createErr(400, "Id should be 24 bytes"));
  }
  const post = await Post.findById({ _id: ObjectId(req.params.id) });
  if (post.likes > 0) {
    await Post.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $inc: { likes: -1 } }
    );
  } else {
    res.send({ message: "Likes already at 0" });
  }

  if (!post) {
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send({ message: "Like removed" });
};

// Update exisitng post (protected endpoint)
exports.update = async function (req, res, next) {
  authService.tokenCheck(req, res, next);
  if (req.params.id.length !== 24) {
    return next(createErr(400, "Id should be 24 bytes"));
  }
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
  authService.tokenCheck(req, res, next);
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
