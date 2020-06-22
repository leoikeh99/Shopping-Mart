const express = require("express");
const router = express.Router();

//Get all users
//Restricted
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Get users" });
});

//Register a user
//Restricted
router.post("/", (req, res) => {
  res.status(200).json({ msg: "Register a user" });
});

module.exports = router;
