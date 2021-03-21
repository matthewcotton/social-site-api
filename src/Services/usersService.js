const bcrypt = require("bcrypt");
const saltRounds = 12;
const { User } = require("../../models/users");
const authService = require("./authService");

// Get data of logged in user (protected endpoint)
exports.singleUser = async function (req, res, next) {
  authService.tokenCheck(req, res, next);
  const user = await User.findOne(
    {
      token: req.headers["authorization"],
      username: req.params.username.toLowerCase(),
    },
    "-_id -password -token"
  );
  if (!user) {
    return next(
      res.status(404).send(`No user found with username ${req.params.username}`)
    );
  }
  res.send(user);
};

// Create a new user (unprotected endpoint)
exports.add = async function (req, res, next) {
  // Check username and password are included in the body
  if (!req.body.username || !req.body.password) {
    return next(res.status(400).send("Username and password required"));
  }
  // Check username doesn't already exisit
  const existingUser = await User.find({
    username: req.body.username.toLowerCase(),
  });
  if (existingUser.length) {
    return next(res.status(409).send("Username already exists"));
  }

  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      return next(res.status(500).send("Password encrypting error"));
    }
    const user = new User({
      username: req.body.username.toLowerCase(),
      password: hash,
    });

    await user.save();
    res.send({ message: "New user profile created" });
  });
};

// Update users password (protected)
exports.updatePassword = async function (req, res, next) {
  authService.tokenCheck(req, res, next);
  // Check username and password are included in the body
  if (!req.body.new_password) {
    return next(res.status(400).send("New password required"));
  }
  // Update password
  bcrypt.hash(req.body.new_password, saltRounds, async (err, hash) => {
    if (err) {
      return next(res.status(500).send("Password encrypting error"));
    }
    const user = await User.findOneAndUpdate(
      {
        token: req.headers["authorization"],
        username: req.params.username.toLowerCase(),
      },
      { password: hash }
    );
    if (!user) {
      return next(
        res
          .status(404)
          .send(`No user found with username ${req.params.username}`)
      );
    }
    res.send({ message: "User profile updated" });
  });
};

// Update users username (protected)
exports.updateUsername = async function (req, res, next) {
  authService.tokenCheck(req, res, next);
  // Update username
  if (!req.body.new_username) {
    return next(res.status(404).send("New username is required"));
  }
  const user = await User.findOneAndUpdate(
    {
      token: req.headers["authorization"],
      username: req.params.username.toLowerCase(),
    },
    { username: req.body.new_username.toLowerCase() }
  );
  if (!user) {
    return next(
      res.status(404).send(`No user found with username ${req.params.username}`)
    );
  }
  res.send({ message: "User profile updated" });
};

// Delete logged in user
exports.delete = async function (req, res, next) {
  authService.tokenCheck(req, res, next);
  const user = await User.findOneAndDelete({
    token: req.headers["authorization"],
    username: req.params.username.toLowerCase(),
  });
  if (!user) {
    return next(
      res.status(404).send(`No user found with username ${req.params.username}`)
    );
  }
  res.send({ message: "User profile deleted" });
};
