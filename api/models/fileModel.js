const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectID,
  title: { type: String, required: true },
  username: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  category: { type: String, required: true },
  filetype: { type: String, required: true },
  thumbnail: { type: String, required: false },
});

module.exports = mongoose.model('File', fileSchema);
