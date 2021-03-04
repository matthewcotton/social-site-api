const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  username: String,
  userId: Number,
  postText: String,
  likes: Number,
  imageData: Object,
  postTitle: String,
  timestamp: String,
  tags: String,
});

module.exports.Post = mongoose.model("Post", postSchema);

// {
//   url: String,
//   creatorUsername: String,
//   creatorLink: String,
// },