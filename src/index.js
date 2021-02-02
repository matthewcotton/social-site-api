// Require express and router
const express = require("express");
const router = require("./router");

// Use dotenv package to parse enviroment variables
const dotenv = require("dotenv");
dotenv.config();

// Require body-parser and morgan
const bodyParser = require("body-parser");
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

// ?????
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "Options") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
});

// Use morgan, bodyParser and router
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(router);

const port = process.env.port || 3001;

// CHANGE ONCE HOSTED (I THINK)
app.listen(port, () => {
  console.log(`Social site api listening at http://localhost:${port}`);
});
