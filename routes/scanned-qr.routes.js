const express = require("express");
const mongoose = require("mongoose");
const _bcrypt = require("bcrypt");
const _jwt = require("jsonwebtoken");
const route = express.Router();
const date = new Date();
const { checkAuthHelper } = require("../helpers/checkAuth.helper");
const ScannedQr = require("../models/scanned-qr.model");
const moment = require('moment');

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

route.get("/scanned-qr/reports", async (req, res) => {
  try {
    let query = {
      leave: { $exists: false }
    };
    if (req.body.tripType) {
      query.tripType = req.body.tripType
    }
    if (req.body.busAccount) {
      query.busAccount = mongoose.Types.ObjectId(req.body.busAccount)
    }
    if (req.body.passengerAccount) {
      query.passengerAccount = mongoose.Types.ObjectId(req.body.passengerAccount)
    }
    if (req.body.tripSched) {
      query.tripSched = mongoose.Types.ObjectId(req.body.tripSched)
    }
    if (req.body.today) {
      query.date = {
        $gte: moment(req.body.today).hours(0).minutes(0).milliseconds(0),
        $lte: moment(req.body.today).hours(59).minutes(59).milliseconds(59)
      }
    }
    if (req.body.dateFrom && req.body.dateTo) {
      query.date = {
        $gte: moment(req.body.dateFrom),
        $lte: moment(req.body.dateTo)
      }
    }
    // return res.status(404).json({ message: query })

    const tripHistory = await ScannedQr
      .find(query)
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

route.post("/scanned-qr/get/trip-history", async (req, res) => {
  console.log(req.body)
  try {
    let query = {
      leave: { $exists: false }
    };
    if (req.body.tripType) {
      query.tripType = req.body.tripType
    }
    if (req.body.busAccount) {
      query.busAccount = mongoose.Types.ObjectId(req.body.busAccount)
    }
    if (req.body.passengerAccount) {
      query.passengerAccount = mongoose.Types.ObjectId(req.body.passengerAccount)
    }
    if (req.body.tripSched) {
      query.tripSched = mongoose.Types.ObjectId(req.body.tripSched)
    }
    if (req.body.today) {
      query.date = {
        $gte: moment(req.body.today).hours(0).minutes(0).milliseconds(0),
        $lte: moment(req.body.today).hours(59).minutes(59).milliseconds(59)
      }
    }
    if (req.body.dateFrom && req.body.dateTo) {
      query.date = {
        $gte: moment(req.body.dateFrom).hours(0).minutes(0).milliseconds(0),
        $lte: moment(req.body.dateTo).hours(59).minutes(59).milliseconds(59)
      }
    }
    // return res.status(404).json({ message: query })

    const tripHistory = await ScannedQr
      .find(query)
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

route.post("/scanned-qr/get/close-contacts", async (req, res) => {
  try {
    if (req.body.parameters && req.body.parameters.length > 0) {
      const bodyParams = req.body.parameters;
      const promise = new Promise((resolve, reject) => {
        const result = [];
        bodyParams.forEach(async (param, index, arr) => {
          const resultItem = {
            date: param.date,
            tripSched: param.tripSched,
            busAccount: param.busAccount,
            closeContacts: []
          }
          let query = {
            leave: { $exists: false }
          };
          if (param.busAccount) {
            query.busAccount = mongoose.Types.ObjectId(param.busAccount._id)
          }
          if (param.passengerAccount) {
            query.passengerAccount = { $ne: mongoose.Types.ObjectId(param.passengerAccount) } 
          }
          if (param.tripSched) {
            query.tripSched = mongoose.Types.ObjectId(param.tripSched._id)
          }
          if (param.date) {
            query.date = {
              $gte: moment(param.date).hours(0).minutes(0).milliseconds(0),
              $lte: moment(param.date).hours(59).minutes(59).milliseconds(59)
            }
          }
          const tripHistory = await ScannedQr
            .find(query)
            .populate("passengerAccount");
          if (tripHistory) {
            resultItem.closeContacts = tripHistory;
            result.push(resultItem);
          }
          if (index === bodyParams.length -1) resolve(result);
        });
      });
      promise.then((data) => {
        res.status(200).json(data);
      })
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

route.post("/scanned-qr/get/count", async (req, res) => {
  try {
    let query = {};
    if (!req.body.All) {
      if (req.body.tripType) {
        query.tripType = req.body.tripType
      }
      if (req.body.busAccount) {
        query.busAccount = req.body.busAccount
        // query.busAccount = mongoose.Types.ObjectId(req.body.busAccount)
      }
      if (req.body.passengerAccount) {
        query.passengerAccount = req.body.passengerAccount
        // query.passengerAccount = mongoose.Types.ObjectId(req.body.passengerAccount)
      }
      if (req.body.tripSched) {
        query.tripSched = req.body.tripSched
        // query.tripSched = mongoose.Types.ObjectId(req.body.tripSched)
      }
      if (req.body.today) {
        query.date = {
          $gte: moment(req.body.today).hours(0).minutes(0).milliseconds(0),
          $lte: moment(req.body.today).hours(59).minutes(59).milliseconds(59)
        }
      }
      if (req.body.dateFrom && req.body.dateTo) {
        query.date = {
          $gte: moment(req.body.dateFrom),
          $lte: moment(req.body.dateTo)
        }
      }
    } else {
      query = {}
    }
    const tripHistoryCount = await ScannedQr.countDocuments(query);
    res.status(200).json(tripHistoryCount)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "System Error: Failed to fetch data." });
  }
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
      temperature,
      tripPlaceOfScan,
      tripSched,
      landmark,
      seatNumber,
      vaccineCode,
      date,
      time,
    } = req.body;

    const scannedQR = new ScannedQr({ //
      tripType: tripType,
      temperature: temperature,
      tripPlaceOfScan: tripPlaceOfScan,
      passengerAccount: mongoose.Types.ObjectId(passengerAccount),
      busAccount: mongoose.Types.ObjectId(busAccount),
      tripSched: mongoose.Types.ObjectId(tripSched),
      landmark: landmark,
      seatNumber: seatNumber,
      vaccineCode: vaccineCode,
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
