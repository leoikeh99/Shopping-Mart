const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

module.exports = async (req, res, next) => {
  if (!req.query.userName && !req.query.password) {
    res.status(401).json({ msg: "Unauthorized" });
  } else {
    try {
      const userName = req.query.userName;
      const password = req.query.password;
      let admin = await Admin.findOne({ userName });

      if (!admin) {
        res.status(400).json({ msg: "Invalid credentials" });
      } else {
        //check password
        const check = await bcrypt.compare(password, admin.password);

        if (!check) {
          res.status(400).json({ msg: "Invalid credentials" });
        } else {
          req.admin = {
            userName,
            password,
          };

          next();
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }
};
