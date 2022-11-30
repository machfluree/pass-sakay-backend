require("dotenv").config();
const _jwt = require("jsonwebtoken");

module.exports = {
  checkAuthHelper: (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    _jwt.verify(token, process.env.ACCESS_TOKEN_SK, (err, user) => {
      if (err) res.sendStatus(401);
      req.user = user;
      next();
    });
  },
};
