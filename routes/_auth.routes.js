const express = require("express");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const authRoutes = express.Router();
const Account = require("../models/accounts.model");
const { checkAuthHelper } = require("../helpers/checkAuth.helper");

authRoutes.post("/refreshToken", (req, res) => {});

authRoutes.post("/auth/login", async (req, res, next) => {
  try {
    const { EmailUsername, Password } = req.body;
    if (!EmailUsername || !Password)
      return res.status(500).json({message: "Missing some login params."})
    
    const aggregate = {
      or: [{ username: EmailUsername }, { email: EmailUsername }],
    };
    const accountMatched = await Account.findOne({username: EmailUsername});

    if (!accountMatched)
      return res.status(404).json({error: "No account matched with the given email or username"});

    const checkPassword = await _bcrypt.compare(Password, accountMatched.password);
    if (checkPassword) {
      const responseAccount = {
        _id: accountMatched._id.toString(),
        _userId: accountMatched._userID,
        username: accountMatched.username,
        userRole: accountMatched.userRole,
        email: accountMatched.email,
      };
      const accessToken = _jwt.sign(
        { data: JSON.stringify(responseAccount) },
        process.env.ACCESS_TOKEN_SK,
        { expiresIn: 60 * 60 },
      );
      res.status(200).json({ accessToken });
    } else {
      return res.status(400).json({error: "Password incorrect."});
    }
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/auth/logout", (req, res) => {});

module.exports = authRoutes;
