//this is the middleware file
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileRoutes = require("./api/routes/filesRoutes");
const userRoutes = require("./api/routes/userRoutes");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/lantube";

//body parsing
//or use app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connection to server
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.once("open", (_) => {
  console.log("Database connected:", url);
});
db.on("error", (err) => {
  console.error("connection error:", err);
});

//handling cors
//or use app.use(corse())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST ,GET , PUT, DELETE, PATCH"
    );
    return res.status(200).json({});
  }
  next();
});

//making the upload folder publicly availaible
app.use("/profileImages", express.static("profileImages"));
app.use(express.static("./profileImages"));

//middleware for protecting and differentiate between different routes
app.use("/file", fileRoutes);
app.use("/user", userRoutes);

//handling errors
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
