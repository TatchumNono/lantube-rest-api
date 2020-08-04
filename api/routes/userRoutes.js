const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mime = require("mime");
//const profileImageUpload = require("../middleware/profileImage-multer"); from multer
//const ProfileImageUpload = require("../middleware/profileImageUpload");

//user model
const User = require("../models/userModel");

router.post("/signup", (req, res, next) => {
  const { name, username, password, profileImage } = req.body;
  var matches = profileImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");
  //let date = new Date().toISOString();
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.getExtension(type);
  let fileName = name + "." + extension;

  fs.writeFile("./profileImages/" + fileName, imageBuffer, function (err) {
    if (err) console.log(err);
  });
  if (fs.writeFile) {
    User.findOne({ username: username })
      .exec()
      .then((user) => {
        if (user) {
          return res.status(422).json({
            message: "username already exist",
          });
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                name: name,
                username: username,
                password: hash,
                profileImage: "http://localhost:4000/profileImages/" + fileName,
              });
              user
                .save()
                .then((result) => {
                  res.status(201).json({
                    message: "User Created!",
                    user: result,
                  });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    message: error.message,
                  });
                });
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: error.message,
          file: req.file,
        });
      });
  } else {
    console.log(error);
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.find({ username: username })
    //.select("_id username")
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed 0",
        });
      }
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userID: user[0]._id,
            },
            "secret",
            { expiresIn: "2h" }
          );
          return res.status(200).json({
            message: "Auth successfull",
            token: token,
            user: user,
          });
        } else {
          return res.status(401).json({
            message: "Auth Failed 1",
          });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    });
});

router.get("/users", (req, res, next) => {
  User.find()
    .select("username _id name profileImage")
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        users: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
});

router.get("/users/:userid", (req, res, next) => {
  const id = req.params.userid;
  User.find({ _id: id })
    .select("username _id name profileImage")
    .exec()
    .then((result) => {
      if (result.length < 1) {
        res.status(404).json({
          message: "user not found",
        });
      } else {
        res.status(200).json({
          user: result,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
});

module.exports = router;
