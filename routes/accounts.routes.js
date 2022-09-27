const express = require("express");
const _bcrypt = require("bcrypt");
const route = express.Router();
const Account = require("../models/accounts.model");

// get accounts
route.get("/accounts", async (req, res, next) => {
  try {
    const accounts = await Account.find();
    console.log("get all accounts worked.");
    res.json(accounts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// get a user
route.get("/accounts/:id", getAccountMiddleware, (req, res, next) => {
  try {
    res.send(res.account);
  } catch (error) {
    next(error);
  }
});

// create a user
route.post("/accounts", async (req, res, next) => {
  try {
    const { UserID, Email, Username, Password } = req.body;

    const _bcryptSalt = await _bcrypt.genSalt(8);
    const hashedPassword = await _bcrypt.hash(Password, _bcryptSalt);

    const account = new Account({
      _userID: UserID,
      email: Email,
      username: Username,
      password: hashedPassword,
    });

    const newUser = await account.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// update a user
route.put("/accounts/:id", getAccountMiddleware, async (req, res, next) => {
  const { UserID, Email, Username, Password, Status } = req.body;

  if (UserID) res.account._userID = UserID;
  if (Email) res.account.email = Email;
  if (Username) res.account.username = Username;
  if (Password) res.account.password = Password;
  if (Status !== null) res.account.status = Status;
  res.account.dateModified = Date.now();

  try {
    const updatedAccount = await res.account.save();
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

async function getAccountMiddleware(req, res, next) {
  let account;
  try {
    account = await Account.findById(req.params.id);
    if (!account)
      return res.status(404).json({ message: "Account not found." });
  } catch (error) {
    console.error(error);
    next(error);
  }
  res.account = account;
  next();
}

module.exports = route;
