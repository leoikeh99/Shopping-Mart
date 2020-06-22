const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { genSalt } = require("bcryptjs");
const { query, validationResult } = require("express-validator");

const authAdmin = require("../middleWare/authAdmin");
const Admin = require("../models/Admin");

//Register an new admin
router.post(
  "/",
  [
    authAdmin,
    query(
      "adminPassword",
      "Password length should be greater than 6"
    ).isLength({ min: 6 }),
    query("newAdmin", "Please add a username").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newAdmin = req.query.newAdmin; //username for new admin
    const adminPassword = req.query.adminPassword; //password for new admin

    try {
      //check if username already exists
      let check = await Admin.findOne({ userName: newAdmin });
      if (check) {
        return res.status(400).json({ msg: "Username already exists" });
      }

      //create new admin
      let admin = new Admin({
        userName: newAdmin,
        password: adminPassword,
      });
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);

      await admin.save(); //save admin
      let response = await Admin.findOne({ userName: newAdmin });
      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

//Update admins
//Restricted
router.put("/", authAdmin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newUsername = req.query.newUsername; //new username for admin
  const newPassword = req.query.newPassword; //new password for admin

  try {
    //check if username already exists
    let check = false;
    if (newUsername) {
      check = await Admin.findOne({ userName: newUsername });
    }
    if (check && req.admin.userName !== newUsername) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    let updateDetails = {};
    if (newUsername) updateDetails.userName = newUsername;
    if (newPassword) updateDetails.password = newPassword;

    if (newPassword) {
      //Only hash password if there is a newPassword
      const salt = await bcrypt.genSalt(10);
      updateDetails.password = await bcrypt.hash(updateDetails.password, salt);
    }

    let update = await Admin.findByIdAndUpdate(
      req.admin.id,
      { $set: updateDetails },
      { new: true }
    );

    res.json(update);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
