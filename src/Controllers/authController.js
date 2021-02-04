const createErr = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../../models/users");

// Authentication
exports.auth = async function (req, res, next) {
  const user = await User.findOne({
    username: req.body.username.toLowerCase(),
  });
  if (!user) {
    return next(createErr(401, "Incorrect username"));
  }
  // Password check
  // Make this a hash
  if (req.body.password !== user.password) {
    return next(createErr(403, "Incorrect password"));
  }
  user.token = uuidv4();
  await user.save();
  res.send({ token: user.token });
};

// Token Check
exports.tokenCheck = async function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const user = await User.findOne({ token: authHeader });
  if (user) {
    return;
  } else {
    next(createErr(401, "Authentication failed"));
  }
};
