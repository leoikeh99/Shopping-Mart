const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Token needed for authorization" });
  }

  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));

    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token not valid" });
  }
};
