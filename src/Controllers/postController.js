const createErr = require("http-errors");
const { ObjectId } = require("mongodb");
const { Post } = require("../../models/posts");
const { User } = require("../../models/users");

async function tokenCheck(req, res, next) {
  const authHeader = req.headers["authorization"];
  const user = await User.findOne({ token: authHeader });
  if (user) {
    next();
  } else {
    next(createErr(403, "Authentication failed"));
  }
}

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
    // confirm that an empty object isn't returned from find function
    return next(
      createErr(404, `No posts found with username ${req.params.username}`)
    );
  }
  res.send(posts);
};

// Get a single post based on post id (unprotected endpoint)
exports.singlePost = async function (req, res, next) {
  const post = await Post.findOne({ _id: ObjectId(req.params.id) });
  console.log(post)
  if (!post) {
    // confirm that an empty object isn't returned from findOne function
    return next(createErr(404, `No post found with id ${req.params.id}`));
  }
  res.send(post);
};

// Add new post (protected endpoint)
exports.add = async function (req, res, next) {
  tokenCheck(req, res, next);
  // ADD Check that all required content is included in the body
  const post = new Post(req.body);
  await post.save();
  res.send({ message: "New post added" });
};

// Update exisitng post (protected endpoint)
exports.update = async function (req, res, next) {
  tokenCheck(req, res, next);
  // ADD Checks
  // Can not update username, userId or origianl time stamp.
  // Add a new timestamp
  await Post.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Post updated" });
};

// Delete a post (protected endpoint)
exports.delete = async function (req, res, next) {
  tokenCheck(req, res, next);
  await Post.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Post deleted" });
};
