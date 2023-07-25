const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  phone: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  role: { type: String },
  password: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
