const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/User");
const authUser = require("../middleWare/authUser");

//Authenticate a user
//Private
router.post(
  "/",
  [
    check("email", "Email not valid").isEmail(),
    check("password", "Password must be greater than 6 characters").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const check = await bcrypt.compare(password, user.password);
      if (!check) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

//Get Logged in/ Authenticated user
//Private
router.get("/", authUser, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
