const express = require("express");
const _bcrypt = require("bcrypt");
const route = express.Router();
const PositiveCase = require("../models/positiveCases.model");
const { checkAuthHelper } = require("../helpers/checkAuth.helper");

// get accounts
route.get("/positive-case", async (req, res) => {
  try {
    const accounts = await Account.find();
    console.log("get all accounts worked.");
    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
});

// get a user
route.get("/accounts/:id", [checkAuthHelper, getAccountMiddleware], (req, res) => {
  console.log("fasdfad", req.user)
  res.send(res.account);
});

// create a user
route.post("/positive-case", async (req, res) => {
  try {
    const { passengerAccount, dateTaggedAsPositive, status } = req.body;
    const newPositiveCase = new PositiveCase({
      passengerAccount: passengerAccount,
      dateTaggedAsPositive: dateTaggedAsPositive,
      status: status,
      closeContacts: [],
      tripHistory: [],
    });
    res.status(201).json({status: true, newPositiveCase});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// update a user
route.put("/accounts/:id", [checkAuthHelper, getAccountMiddleware], async (req, res) => {
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
    res.status(400).json({ error_message: error.message });
  }
});

async function getAccountMiddleware(req, res, next) {
  let account;
  try {
    account = await Account.findById(req.params.id)
    if (!account) return res.status(404).json({ message: "Account not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
  res.account = account;
  next();
}

module.exports = route;
