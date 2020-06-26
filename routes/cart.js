const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authUser = require("../middleWare/authUser");
const { findByIdAndUpdate } = require("../models/Cart");

router.post("/:id", authUser, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).json({ msg: "Not a product" });
    }
    if (product.stockCount === 0) {
      return res.status(400).json({ msg: "Product finished in stock" });
    }
    const cart = await Cart.findOne({
      user: req.user.id,
      product: req.params.id,
    });
    if (!cart) {
      const newCart = new Cart({
        user: req.user.id,
        product: req.params.id,
        amount: 1,
      });

      const savedCart = await newCart.save();
      res.json(savedCart);
    } else {
      const updateAmount = await Cart.findByIdAndUpdate(
        cart.id,
        { $set: { amount: cart.amount + 1 } },
        { new: true }
      );
      res.json(updateAmount);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
