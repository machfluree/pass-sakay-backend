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
route.get("/passengers", async (req, res) => {
  try {
    const passengers = await Passenger.find();
    console.log("get all passengers worked.");
    res.json(passengers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// get a user
route.get("/passengers/:id", [getPassengerMiddleware], (req, res) => {
  console.log("get one passenger", req.passenger);
  res.send(res.passenger);
});
// const tripHistoryCount = await ScannedQr.countDocuments(query);
//     res.status(200).json(tripHistoryCount)

route.post("/passengers/get/count", async (req, res) => {
  try {
    const passengerCount = await Passenger.countDocuments();
    res.status(200).json(passengerCount)
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server failed to fetch data."});
  }
});


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

    const agg = [
      {
        $match: {
          $or: [
            { username: Username },
            { email: ActiveEmailAdd },
          ],
        },
      },
    ];
    const accountMatched = await Account.aggregate(agg);
    if (accountMatched.length > 0) {
      return res.status(400).json({ message: "User already has an account." });
    } else {
      const newPassenger = await passenger.save();
      // const hashedPassengerId = await _bcrypt.hash(newPassenger._id.toString(), 8);
      const UserID = newPassenger._id;
      const passengerData = {
        fullname:
          newPassenger.lastname +
          ", " +
          newPassenger.firstname +
          " " +
          newPassenger.middlename,
        secret_id: newPassenger._id.toString(),
        currentAddress: newPassenger.currentAddress,
      };
      const hashedPassword = await _bcrypt.hash(Password, 8);
      const account = new Account({
        _userID: UserID,
        email: ActiveEmailAdd,
        username: Username,
        userRole: "passenger",
        password: hashedPassword,
      });
      const newPassengerAccount = await account.save();
      if (newPassengerAccount) {
        res.status(201).json({ passengerData: passengerData });
      } else {
        res.status(400).json({ message: "Passenger account not created." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save passenger" });
  }
  res.send();
});

// update a user
route.put("/passengers/:id", [getPassengerMiddleware], async (req, res) => {
  const {
    Lastname,
    Firstname,
    Middlename,
    Gender,
    Birthdate,
    ActiveContactNumber,
    CurrentAddress,
    HomeAddress,
    ActiveEmailAdd,
    Status,
  } = req.body;

  if (Lastname) res.passenger.lastname = Lastname;
  if (Firstname) res.passenger.firstname = Firstname;
  if (Middlename) res.passenger.middlename = Middlename;
  if (Gender) res.passenger.gender = Gender;
  if (Birthdate) res.passenger.birthdate = Birthdate;
  if (ActiveContactNumber) res.passenger.phoneNumber = ActiveContactNumber;
  if (CurrentAddress) res.passenger.currentAddress = CurrentAddress;
  if (HomeAddress) res.passenger.homeAddress = HomeAddress;
  if (ActiveEmailAdd) res.passenger.email = ActiveEmailAdd;
  if (Status !== null && Status !== undefined) res.passenger.status = Status;
  res.passenger.dateModified = Date.now();

  try {
    const updatedpassenger = await res.passenger.save();
    res.status(200).json(updatedpassenger);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

async function getPassengerMiddleware(req, res, next) {
  let passenger;
  try {
    passenger = await Passenger.findById(req.params.id);
    if (!passenger)
      return res.status(404).json({ message: "passenger not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
  res.passenger = passenger;
  next();
}

module.exports = route;
