//Admin model
const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("admins", AdminSchema);
