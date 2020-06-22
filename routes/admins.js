const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { genSalt } = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const authAdmin = require("../middleWare/authAdmin");
const Admin = require("../models/Admin");

//Register an new admin
router.post(
  "/",
  [
    authAdmin,
    check(
      "adminPassword",
      "Password length should be greater than 6"
    ).isLength({ min: 6 }),
    check("newAdmin", "Please add a username").not().isEmpty(),
  ],
  async (req, res) => {
    //authAdmin middleware first authenticates user then express validator validates input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //checks for any errors in input
      return res.status(400).json({ errors: errors.array() });
    }
    const newAdmin = req.body.newAdmin; //username for new admin
    const adminPassword = req.body.adminPassword; //password for new admin

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

      //hash password with bycrypt
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);

      await admin.save(); //save admin
      let response = await Admin.findOne({ userName: newAdmin }); //finds new admin that was just saved
      res.json(response); //returns new admin
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

//Update admins
//Restricted
router.put(
  "/",
  [
    authAdmin,
    [
      check(
        "newPassword",
        "Password length should be greater than 6"
      ).isLength({ min: 6 }),
      check("newUsername", "Please add a username").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //authAdmin middleware first authenticates user
    const newUsername = req.body.newUsername; //new username for admin
    const newPassword = req.body.newPassword; //new password for admin

    try {
      //check if username already exists
      let check = false;
      if (newUsername) {
        check = await Admin.findOne({ userName: newUsername });
      }
      if (check && req.admin.userName !== newUsername) {
        return res.status(400).json({ msg: "Username already exists" });
      }

      //set update details
      let updateDetails = {};
      if (newUsername) updateDetails.userName = newUsername;
      if (newPassword) updateDetails.password = newPassword;

      //Only hash new password if new password is inputed
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        updateDetails.password = await bcrypt.hash(
          updateDetails.password,
          salt
        );
      }

      let update = await Admin.findByIdAndUpdate(
        //updates admin details
        req.admin.id,
        { $set: updateDetails },
        { new: true }
      );

      res.json(update);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// delete an admin
//Restricted
router.delete("/", authAdmin, async (req, res) => {
  //authAdmin middleware first authenticates user
  try {
    let admin = await Admin.findByIdAndRemove(req.admin.id); //deletes admin
    res.json({ msg: "Your admin rights have been anulled" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all admins
//Restricted
router.get("/", authAdmin, async (req, res) => {
  //authAdmin middleware first authenticates user
  try {
    let adminUsers = await Admin.find({}); //gets all admins
    const adminUsernames = adminUsers.map((adminUser) => adminUser.userName); //returns all admin usernames
    res.json({ users: adminUsernames });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
