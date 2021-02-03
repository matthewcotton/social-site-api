const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  username: String,
  userId: Number,
  postText: String,
  likes: Number,
  imageUrl: String,
  postTitle: String,
  timestamp: String,
  tags: String,
});

module.exports.Post = mongoose.model("Post", postSchema);
