// Require express and controller
const express = require("express");
const controller = require("./controller");
const cors = require("cors");

// Use dotenv package to parse enviroment variables
const dotenv = require("dotenv");
dotenv.config();

// Require morgan
const morgan = require("morgan");

// Require mongoose and connect to database
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@cluster0.3e1h8.mongodb.net/social-site?retryWrites=true&w=majority`
);
const db = mongoose.connection;

// Define Express app
const app = express();

// Check connection to database
db.on("error", (err) => {
  console.log(
    `Error occured while connecting to the database. Error code ${err.message}`
  );
});
db.once("open", () => {
  console.log(`Sucessfully connected to the social-site database.`);
});

// Use morgan, json parser, cors and controller
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(controller);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Social site api listening at http://localhost:${port}`);
});

/* NOTES */
// Check all deprication warnings
// Add pagination to responses
// Usernames to be stored in lowercase only
