const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  userId: Number,
  postText: String, 
  likes: Number,
  imageUrl: String,
  postTitle: String,
  timestamp: String,
  tags: String,
})

module.exports.User = mongoose.model('User', userSchema)