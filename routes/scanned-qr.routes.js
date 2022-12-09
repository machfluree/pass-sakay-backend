const express = require("express");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const route = express.Router();
const date = new Date();
const { checkAuthHelper } = require("../helpers/checkAuth.helper");
const ScannedQr = require("../models/scanned-qr");

route.get("/scanned-qr", async (req, res) => {
  try {
    const scannedQR = await ScannedQr.find();
    console.log("get all scanned qr worked.");
    res.json(scannedQR);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
});

// get a user
route.get("/passengers/:id", [getPassengerMiddleware], (req, res) => {
  console.log("get one passenger", req.passenger);
  res.send(res.passenger);
});

// create a user
route.post("/passengers", async (req, res) => {
  try {
    const {
      passengerId,
      tripType,
      tripDate,
      tripTimeStart,
      tripTimeEnd,
      tripRouteFrom,
      tripRouteTo,
      busName,
      busNumber,
      busDriver
    } = req.body;

    const scannedQR = new ScannedQr({
      passengerId: passengerId,
      tripType: tripType,
      tripDate: tripDate,
      tripTimeStart: tripTimeStart,
      tripTimeEnd: tripTimeEnd,
      tripRouteFrom: tripRouteFrom,
      tripRouteTo: tripRouteTo,
      busName: busName,
      busNumber: busNumber,
      busDriver: busDriver,
    });

    const newScannedQR = await scannedQR.save();
    if (newScannedQR) {
      res.status(201).json({ message: "Scanned QR successfully saved." });
    } else {
      res.status(400).json({ message: "Scanned QR failed to save." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save scanned qr" });
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
    passenger = await Passenger.findById(req.params.id);
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
