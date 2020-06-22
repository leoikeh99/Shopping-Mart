const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authAdmin = require("../middleWare/authAdmin");
const Product = require("../models/Product");

//Get products
//Public
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Get products" });
});

//Add new products
//Restricted
router.post(
  "/",
  [
    authAdmin,
    [
      check("name", "Name is required").not().isEmpty(),
      check("category", "Category is required").not().isEmpty(),
      check("image", "Image URL is required").not().isEmpty(),
    ],
  ],
  (req, res) => {
    //authAdmin middleware first authenticates user then express validator validates input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //checks for any errors in input
      return res.status(400).json({ errors: errors.array() });
    }

    res.status(200).json({ msg: "Add new products" });
  }
);

module.exports = router;
