const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const authAdmin = require("../middleWare/authAdmin");
const Product = require("../models/Product");

//Get products
//Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Add a new product
//Restricted
router.post(
  "/",
  [
    authAdmin,
    [
      check("name", "Name is required").not().isEmpty(),
      check("category", "Category is required").not().isEmpty(),
      check("price", "Price is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //authAdmin middleware first authenticates user then express validator validates input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //checks for any errors in input
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        name,
        category,
        price,
        image,
        subCategories,
        stockCount,
        desc,
      } = req.body;

      //check if a product has the same name and description
      const check = await Product.findOne({ name });
      if (check && check.name === name && check.desc === desc) {
        return res.status(400).json({
          msg: "Product with the same name and description already exixts",
        });
      }

      const newProduct = new Product({
        name,
        price,
        category,
        image,
        subCategories,
        stockCount,
        desc,
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//Update a product
//Restricted
router.put("/:id", authAdmin, async (req, res) => {
  const {
    name,
    category,
    price,
    image,
    subCategories,
    stockCount,
    desc,
  } = req.body;

  //create update object
  const productDetails = {};
  if (name) productDetails.pricename = name;
  if (category) productDetails.category = category;
  if (price) productDetails.price = price;
  if (image) productDetails.image = image;
  if (subCategories) productDetails.subCategories = subCategories;
  if (stockCount) productDetails.stockCount = stockCount;
  if (desc) productDetails.desc = desc;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productDetails },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Delete a product
//Restricted
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product = await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
