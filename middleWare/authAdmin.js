const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

//This middleware authenticates an admin
module.exports = async (req, res, next) => {
  if (!req.body.userName && !req.body.password) {
    //checks if user req.body data is available
    res.status(401).json({ msg: "Unauthorized" });
  } else {
    try {
      const userName = req.body.userName;
      const password = req.body.password;

      //checks for admin username
      let admin = await Admin.findOne({ userName });
      if (!admin) {
        res.status(400).json({ msg: "Invalid credentials" });
      } else {
        //checks if password is valid
        const check = await bcrypt.compare(password, admin.password);
        if (!check) {
          res.status(400).json({ msg: "Invalid credentials" });
        } else {
          req.admin = {
            //stores admin details in request header
            userName,
            password,
            id: admin.id,
          };

          next(); //moves to the next
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
};
