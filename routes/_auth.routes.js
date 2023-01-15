const express = require("express");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const _nodemailer = require("nodemailer");
const body_parser = require("body-parser");
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

authRoutes.post("/auth/verify-user-email", (req, res) => {
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has been sent and the id is ${info.messageId}`);
    res.send(info);
  });
});

authRoutes.post("/auth/test-mail", (req, res) => {
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has been sent and the id is ${info.messageId}`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = _nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
      clientId: process.env.MAILER_OAUTH_CLIENTID,
      clientSecret: process.env.MAILER_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.MAILER_REFRESH_TOKEN,
      accessToken: ""
    }
  });

  let mailOptions = {
    from: "pass.sakay@gmail.com",
    to: user.email,
    subject: 'Pass Sakay App - Verify your Email',
    html: `
      Hi ${user.name}! <br><br>
      You registered your email to Pass Sakay App. To confirm your registration here is your
      OTP Code: <strong>${user.OTP}</strong>. <br><br>
      <strong><i>Please do not share your OTP.</i></strong> Thank you. <br><br><br>
      Regards, <br>
      Pass Sakay Support Team
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  callback(info);
}

module.exports = authRoutes;
