const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");
const authAdmin = require("../middleWare/authAdmin");

//Register a user
//Private
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Input a valid email").isEmail(),
    check(
      "password",
      "Password length should be greater than 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already eists" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

//Get all users
//Restricted
router.get("/", authAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    let userDetails = [];
    users.forEach((user) => {
      const details = {
        name: user.name,
        email: user.email,
        created_at: user.date,
      };
      userDetails.push(details);
    });
    res.json(userDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
