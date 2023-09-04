const express = require("express");
const app = express();
require("dotenv").config();
const { Database } = require("./Database/database");
const cors = require("cors");
const API = require("./Router/router");

//Middleware
app.use(express.json());
app.use(cors());

//Home Server API
app.use("/royalenfield", API);

//Running the PORT
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error in the Connection");
  } else {
    console.log(`${process.env.PORT} is connected`);
  }
});

// Database Connection
Database();

//Error Handling
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  process.exit(1);
});
