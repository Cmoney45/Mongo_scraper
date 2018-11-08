const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const db = require("./models");
const PORT = 3000;
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

require("./routes/routeIndex")(app, db);

app.listen(PORT, () => {
  console.log("App running on port " + PORT + "!");
});
