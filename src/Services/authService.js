const createErr = require("http-errors"); //remove
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models/users");

const dotenv = require("dotenv");
dotenv.config();

// Authentication
exports.auth = async function (req, res, next) {
  const user = await User.findOne({
    username: req.body.username.toLowerCase(),
  });
  if (!user) {
    return next(createErr(401, "Incorrect username"));
  }
  // Password check
  bcrypt.compare(req.body.password, user.password, async (err, result) => {
    if (err) {
      return next(res.status(500).send("Password encrypting error"));
    }
    if (!result) {
      return next(res.status(403).send("Incorrect password"));
    }
    user.token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60 days" }
    );
    await user.save();
    res.send({ token: user.token, username: user.username });
  });
};

// Token Check
exports.tokenCheck = async function (req, res, next) {
  const token = req.headers["authorization"];
  if (!token)
    return next(
      res
        .status(401)
        .send("Authentication failed. No token included with request.")
    );
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);
    if (user) {
      return user;
    } else {
      return next(
        res.status(401).send("Authentication failed. No user found.")
      );
    }
  } catch (err) {
    next(res.status(500).send("Authentication failed. JWT verify error."));
  }
};
