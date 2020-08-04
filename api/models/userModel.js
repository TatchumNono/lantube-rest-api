const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectID,
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profileImage: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
