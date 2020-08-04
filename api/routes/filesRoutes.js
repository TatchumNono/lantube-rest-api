const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auths");

//route to get all the files
router.get("/", checkAuth, (req, res, next) => {
  res.status(200).json({
    message: "Routes concerned with files are here",
  });
});

//routes to upload a file
router.post("/upload", (req, res, next) => {
  const file = {
    fileName: req.body.file,
    title: req.body.title,
    category: req.body.category,
  };
  res.status(201).json({
    message: "Uploading files Here",
    uploadedfile: file,
  });
});

//route to search for a file in the DB
router.post("/search", (req, res, next) => {
  res.status(200).json({
    message: "Searching for files in the DB",
  });
});

//route to get a file by ID
router.get("/:id", (req, res, next) => {
  const id = req.params.fileID;
  if (id === "") {
    res.status(200).json({
      message: "You did not pass an id",
    });
  } else {
    res.status(200).json({
      message: "You passed an ID",
    });
  }
});

module.exports = router;
