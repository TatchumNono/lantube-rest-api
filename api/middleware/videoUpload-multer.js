const multer = require("multer");

//profile image upload handler
//setting the name of the file to the original file name
const profileImageHandler = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./profileImages");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//filtering incoming file types
const fileFilter = (req, file, cb) => {
  //reject file condition
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File not posted"), false);
  }
};

//multer options
const upload = multer({
  storage: profileImageHandler,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: fileFilter,
});

module.exports = upload;
