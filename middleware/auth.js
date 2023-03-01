const { JWTSecretToken } = require("../configs/config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("no token provided");
    return;
  }
  const payload = jwt.verify(token, JWTSecretToken);
  req.user = payload;
  next();
};
