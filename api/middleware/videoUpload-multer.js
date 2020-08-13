const multer = require('multer');

//profile image upload handler
//setting the name of the file to the original file name
const profileImageHandler = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//filtering incoming file types
const fileFilter = (req, file, cb) => {
  //reject file condition
  if (
    file.mimetype === 'video/mkv' ||
    file.mimetype === 'video/3gp' ||
    file.mimetype === 'video/mp4'
  ) {
    cb(null, true);
  } else {
    cb(new Error('File not posted'), false);
  }
};

//multer options
const upload = multer({
  storage: profileImageHandler,
  fileFilter: fileFilter,
});

module.exports = upload.single('file');
