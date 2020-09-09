const fs = require('fs');
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();
const checkAuth = require('../middleware/check-auths');
const upload = require('../middleware/videoUpload-multer');

const File = require('../models/fileModel');

//route to get all the files
router.get('/', (req, res, next) => {
  File.find()
    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        file: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
});

//routes to upload a file checkAuth,
//the field of the file named 'file' is passed with the middlewaere 'upload'
router.post('/upload', checkAuth, upload, (req, res) => {
  let filePath = '';
  ffmpeg(req.file.path)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '));
      filePath = 'assets/thumbnail/' + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      const file = new File({
        username: req.body.username,
        title: req.body.title,
        category: req.body.category,
        filename: req.file.filename,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        thumbnail: 'http://localhost:4000/' + filePath,
      });

      file
        .save()
        .then((result) => {
          res.status(200).json({
            message: 'uploaded',
            result: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .on('error', function (err) {
      console.error(err);
    })
    .screenshots({
      // Will take screenshots at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: './assets/thumbnail',
      size: '300x200',
      filename: '%b.png',
    });
});

router.get('/stream', (req, res) => {
  const { filePath } = req.query;
  console.log(filePath);
  const path = filePath;
  //const type = req.body.filetype;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

//route to search for a file in the DB
router.post('/search', (req, res, next) => {
  res.status(200).json({
    message: 'Searching for files in the DB',
  });
});

//route to get a file by ID
router.get('/files/:fileID', (req, res, next) => {
  const id = req.params.fileID;
  File.find({ _id: id })
    //.select('username _id name profileImage')
    .exec()
    .then((result) => {
      if (result.length < 1) {
        res.status(404).json({
          message: 'file not found',
        });
      } else {
        res.status(200).json({
          file: result,
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
