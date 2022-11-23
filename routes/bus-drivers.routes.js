// TODO: create bus driver routes start with post endpoint
const express = require("express");
const _bcrypt = require("bcrypt");
const route = express.Router();
const BusDriver = require("../models/bus-driver.model");
const Account = require("../models/accounts.model");
const { checkAuthHelper } = require("../helpers/checkAuth.helper");

// get bus-drivers
route.get("/bus-drivers", async (req, res) => {
  try {
    const busDrivers = await BusDriver.find();
    console.log("get all bus-drivers worked.");
    res.json(busDrivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
});

// get a user
route.get("/bus-drivers/:id", [checkAuthHelper, getBusDriverMiddleware], (req, res) => {
  console.log("user token", req.user)
  res.send(res.busDriver);
});

// create a bus-driver
route.post("/bus-drivers", async (req, res) => {
  try {
    const { 
      // basic info
      BusName, 
      BusNumber, 
      BusProvince, 
      OperatorFullName, 
      OperatorPosition,
      OperatorPhoneNumber,
      // account info
      Email,
      Password,
      Username
    } = req.body;

    if (
      !BusName || 
      !BusNumber || 
      !BusProvince || 
      !OperatorFullName || 
      !OperatorPosition ||
      !OperatorPhoneNumber ||
      !Password ||
      !Username
    ) return res.status(500).json({error: 'Missing required fields on payload.'})

    const busDriver = new BusDriver({
      busName: BusName,
      busNumber: BusNumber,
      busProvince: BusProvince,
      operatorFullName: OperatorFullName,
      operatorPosition: OperatorPosition,
      operatorPhoneNumber: OperatorPhoneNumber
    });

    const newBusDriver = await busDriver.save();

    // TODO: save account here
    const UserID = newBusDriver._id;
    const agg = [{ $match: { $or: [{ _userID: UserID }, { username: Username }] } }]
    const accountMatched = await Account.aggregate(agg);
    if (accountMatched.length > 0) {
      return res.status(400).json({ message: "User already has an account." });
    }
    const hashedPassword = await _bcrypt.hash(Password, 8);
    const account = new Account({
      _userID: UserID,
      email: Email,
      username: Username,
      userRole: 'bus-driver',
      password: hashedPassword,
    });
    await account.save();

    res.status(201).json(newBusDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
  res.send();
});

// update a user
route.put("/bus-drivers/:id", [checkAuthHelper, getBusDriverMiddleware], async (req, res) => {
  const { UserID, Email, Username, Password, Status } = req.body;

  if (UserID) res.busDriver._userID = UserID;
  if (Email) res.busDriver.email = Email;
  if (Username) res.busDriver.username = Username;
  if (Password) res.busDriver.password = Password;
  if (Status !== null) res.busDriver.status = Status;
  res.busDriver.dateModified = Date.now();

  try {
    const updateBusDriver = await res.busDriver.save();
    res.status(200).json(updateBusDriver);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error_message: error.message });
  }
});

async function getBusDriverMiddleware(req, res, next) {
  let busDriver;
  try {
    busDriver = await BusDriver.findById(req.params.id)
    if (!accoubusDrivernt) return res.status(404).json({ message: "Bus Driver not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
  res.busDriver = busDriver;
  next();
}

module.exports = route;