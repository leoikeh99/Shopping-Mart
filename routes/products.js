const express = require("express");
const router = express.Router();

//Get all products
//Public
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Get products" });
});

module.exports = router;
