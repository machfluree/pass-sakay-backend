const express = require("express");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const route = express.Router();
// const moment = require("moment")
const date = new Date();
const Passenger = require("../models/passenger.model");
const Account = require("../models/accounts.model");
const { checkAuthHelper } = require("../helpers/checkAuth.helper");

// get passengers
route.get(
  "/passengers",
  [checkAuthHelper, getPassengerMiddleware],
  async (req, res) => {
    try {
      const passengers = await Passenger.find();
      console.log("get all passengers worked.");
      res.json(passengers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error_message: error.message });
    }
  },
);

// get a user
route.get(
  "/passengers/:id",
  [checkAuthHelper, getPassengerMiddleware],
  (req, res) => {
    console.log("fasdfad", req.user);
    res.send(res.passenger);
  },
);

// create a user
route.post("/passengers", async (req, res) => {
  try {
    const {
      Lastname,
      Firstname,
      Middlename,
      Gender,
      Birthdate,
      ActiveContactNumber,
      CurrentAddress,
      HomeAddress,
      //
      ActiveEmailAdd,
      Username,
      Password,
    } = req.body;

    const passenger = new Passenger({
      lastname: Lastname,
      firstname: Firstname,
      middlename: Middlename,
      gender: Gender,
      birthdate: Birthdate,
      phoneNumber: ActiveContactNumber,
      email: ActiveEmailAdd,
      currentAddress: CurrentAddress,
      homeAddress: HomeAddress,
      dateAdded: date.toISOString(),
    });

    const newPassenger = await passenger.save();
    const hashedPassengerId = await _bcrypt.hash(newPassenger._id.toString(), 8);
    const passengerData = {
        fullname: newPassenger.lastname + ", " + newPassenger.firstname + " " + newPassenger.middlename,
        secret_id: hashedPassengerId,
        currentAddress: newPassenger.currentAddress
    }

    // TODO: save account here
    const UserID = newPassenger._id;
    const agg = [{ $match: { $or: [{ _userID: UserID }, { username: Username }] } }]
    const accountMatched = await Account.aggregate(agg);
    if (accountMatched.length > 0) {
      return res.status(400).json({ message: "User already has an account." });
    }
    const hashedPassword = await _bcrypt.hash(Password, 8);
    const account = new Account({
      _userID: UserID,
      email: ActiveEmailAdd,
      username: Username,
      userRole: 'passenger',
      password: hashedPassword,
    });
    await account.save();
    res.status(201).json({passengerData: passengerData});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save passenger" });
  }
  res.send();
});

// update a user
route.put(
  "/passengers/:id",
  [checkAuthHelper, getPassengerMiddleware],
  async (req, res) => {
    const { UserID, Email, Username, Password, Status } = req.body;

    if (UserID) res.passenger._userID = UserID;
    if (Email) res.passenger.email = Email;
    if (Username) res.passenger.username = Username;
    if (Password) res.passenger.password = Password;
    if (Status !== null) res.passenger.status = Status;
    res.passenger.dateModified = Date.now();

    try {
      const updatedpassenger = await res.passenger.save();
      res.status(200).json(updatedpassenger);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error_message: error.message });
    }
  },
);

async function getPassengerMiddleware(req, res, next) {
  let passenger;
  try {
    passenger = await passenger.findById(req.params.id);
    if (!passenger)
      return res.status(404).json({ message: "passenger not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
  res.passenger = passenger;
  next();
}

module.exports = route;
