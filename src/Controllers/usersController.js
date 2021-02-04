const createErr = require("http-errors");
const { User } = require("../../models/users");
const authController = require("./authController");

// Get data of logged in user (protected endpoint)
exports.singleUser = async function (req, res, next) {
  authController.tokenCheck(req, res, next);
  const user = await User.findOne(
    {
      token: req.headers["authorization"],
      username: req.params.username.toLowerCase(),
    },
    "-_id -password -token"
  );
  if (!user) {
    return next(
      createErr(404, `No user found with username ${req.params.username}`)
    );
  }
  res.send(user);
};

// Create a new user (unprotected endpoint)
exports.add = async function (req, res, next) {
  // Check username and password are included in the body
  if (!req.body.username || !req.body.password) {
    return next(createErr(400, "Username and password required"));
  }
  // Check username doesn't already exisit
  if (await User.find({ username: req.body.username.toLowerCase() })) {
    return next(createErr(409, "Username already exists"));
  }
  const user = new User({
    username: req.body.username.toLowerCase(),
    password: req.body.password,
  });
  await user.save();
  res.send({ message: "New user profile created" });
};

// Update logged in user (protected endpoint)
exports.update = async function (req, res, next) {
  authController.tokenCheck(req, res, next);
  // Update password
  if (req.body.new_password) {
    const user = await User.findOneAndUpdate(
      {
        token: req.headers["authorization"],
        username: req.params.username.toLowerCase(),
      },
      { password: req.body.new_password }
    );
    if (!user) {
      return next(
        createErr(404, `No user found with username ${req.params.username}`)
      );
    }
  }
  // Update username
  if (req.body.new_username) {
    const user = await User.findOneAndUpdate(
      {
        token: req.headers["authorization"],
        username: req.params.username.toLowerCase(),
      },
      { username: req.body.new_username.toLowerCase() }
    );
    if (!user) {
      return next(
        createErr(404, `No user found with username ${req.params.username}`)
      );
    }
  }
  res.send({ message: "User profile updated" });
};

// Delete logged in user
exports.delete = async function (req, res, next) {
  authController.tokenCheck(req, res, next);
  const user = await User.findOneAndDelete({
    token: req.headers["authorization"],
    username: req.params.username.toLowerCase(),
  });
  if (!user) {
    return next(
      createErr(404, `No user found with username ${req.params.username}`)
    );
  }
  res.send({ message: "User profile deleted" });
};

// ADD catches where a filure will crash the api server
