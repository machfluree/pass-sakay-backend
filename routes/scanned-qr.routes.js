const express = require("express");
const mongoose = require("mongoose");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const route = express.Router();
const date = new Date();
const { checkAuthHelper } = require("../helpers/checkAuth.helper");
const ScannedQr = require("../models/scanned-qr.model");

route.get("/scanned-qr", async (req, res) => {
  try {
    const tripHistory = await ScannedQr
      .find()
      .populate("busAccount")
      .populate("passengerAccount")
      .populate("tripSched");
    if (!tripHistory) {
      return res.status(404).json({ message: "System Error: Failed to fetch data." })
    } else {
      res.status(200).json(tripHistory)
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "System Error: Failed to fetch data." });
  }
});

// get a user
route.get("/scanned-qr/:id", [getScannedQRMiddleware], (req, res) => {
  console.log("get one scaned qr", req.scannedQR);
  res.send(res.scannedQR);
});

route.get("/scanned-qr/trip-history/:passenger_id", async (req, res) => {
  try {
    const passengerId = mongoose.Types.ObjectId(req.params.passenger_id)
    const passengerTripHistory = await ScannedQr
      .find({ passengerAccount: passengerId })
      .populate("busAccount")
      .populate("passengerAccount")
      .populate("tripSched");
    if (!passengerTripHistory) {
      return res.status(404).json({ message: "System Error: Failed to fetch data." })
    } else {
      res.status(200).json(passengerTripHistory)
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "System Error: Failed to fetch data." });
  }
});

route.get("/scanned-qr/bus-account/:busAccountId", async (req, res) => {
  try {
    const busAccountId = mongoose.Types.ObjectId(req.params.busAccountId)
    const busAccountTripHistory = await ScannedQr
      .find({ busAccount: busAccountId })
      .populate("busAccount")
      .populate("passengerAccount")
      .populate("tripSched");
    if (!busAccountTripHistory) {
      return res.status(404).json({ message: "System Error: Failed to fetch data." })
    } else {
      res.status(200).json(busAccountTripHistory)
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "System Error: Failed to fetch data." });
  }
});

// create a user
route.post("/scanned-qr", async (req, res) => {
  try {
    const {
      passengerAccount,
      tripType,
      busAccount,
      tripSched,
      date,
      time,
    } = req.body;

    const scannedQR = new ScannedQr({
      passengerAccount: mongoose.Types.ObjectId(passengerAccount),
      tripType: tripType,
      busAccount: mongoose.Types.ObjectId(busAccount),
      tripSched: mongoose.Types.ObjectId(tripSched),
      date: date,
      time: time,
    });

    const newScannedQR = await scannedQR.save();
    if (newScannedQR) {
      res.status(201).json({ message: "Scanned QR successfully saved." });
    } else {
      res.status(400).json({ message: "Scanned QR failed to save." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to read scanned QR" });
  }
  res.send();
});

// update a user
route.put(
  "/scanned-qr/:id",
  [getScannedQRMiddleware],
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

async function getScannedQRMiddleware(req, res, next) {
  let scannedQR;
  try {
    scannedQR = await ScannedQr.findById(req.params.id);
    if (!scannedQR)
      return res.status(404).json({ message: "scannedQR not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
  res.scannedQR = scannedQR;
  next();
}

module.exports = route;
