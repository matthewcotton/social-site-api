const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  userId: Number, // probably remove as ObjectId already exisits in the db
  password: String,
  token: String,
});

module.exports.User = mongoose.model("User", userSchema);
