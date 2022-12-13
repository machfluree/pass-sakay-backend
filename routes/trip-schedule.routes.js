// TODO: create bus driver routes start with post endpoint
const express = require("express");
const _bcrypt = require("bcrypt");
const route = express.Router();
const TripSchedule = require("../models/trip-schedule.model");
const BusDriver = require("../models/bus-driver.model");
const Account = require("../models/accounts.model");
const { checkAuthHelper } = require("../helpers/checkAuth.helper");

// get trip schedules
route.get("/trip-schedules", async (req, res) => {
  try {
    const agg = [
      {
        $lookup: {
          from: "busdrivers",
          localField: "busAccount",
          foreignField: "_id",
          as: "busAccounDetails",
        },
      },
    ];
    const tripSchedules = await TripSchedule.find().populate("busAccount");
    res.json(tripSchedules)
    // TripSchedule.find({} , (err,records)=>{
    //     if(records) return records
    //     else throw Error("no records found")
    // })
    // .populate('busAccount')
    // .skip(0).limit(20)
    // .exec()

    // TripSchedule.find().populate({
    //     "path": "BusDriver",
    //     "match": { "busAccount": "_id" }
    // }).exec(function(err,entries) {
    //    entries = entries.filter(function(entry) {
    //        return entry.busAccount != null;
    //    });
    // });

    console.log("get all trip schedules worked.");

    // if (tripSchedules.length) {
    //     const parsedTripSchedules = [];
    //     tripSchedules.forEach(async (tripSched) => {
    //         const busAccount = await BusDriver.findById(tripSched.busAccount);
    //         // console.log(busAccount.busName)
    //         parsedTripSchedules.push({
    //             name: tripSched.name,
    //             busName: busAccount.busName,
    //             daysRoutine: tripSched.daysRoutine,
    //             startTime: tripSched.startTime,
    //             endTime: tripSched.endTime,
    //             startingPoint: tripSched.startingPoint,
    //             finishingPoint: tripSched.finishingPoint,
    //             status: tripSched.status,
    //         })
    //     });
    //     res.status(200).json(parsedTripSchedules);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
});

// get a bus-drivers
route.get("/trip-schedules/:id", [getTripScheduleMiddleware], (req, res) => {
  console.log("user token", req.user);
  res.send(res.tripSchedule);
});

// create a bus-driver
route.post("/trip-schedules", async (req, res) => {
  try {
    const {
      Name,
      BusAccount,
      DaysRoutine,
      StartTime,
      EndTime,
      StartingPoint,
      FinishingPoint,
    } = req.body;

    if (
      !Name ||
      !BusAccount ||
      !DaysRoutine ||
      !StartTime ||
      !EndTime ||
      !StartingPoint ||
      !FinishingPoint
    )
      return res
        .status(500)
        .json({ error: "Missing required fields on payload." });

    const tripSchedule = new TripSchedule({
      name: Name,
      busAccount: BusAccount,
      daysRoutine: DaysRoutine,
      startTime: StartTime,
      endTime: EndTime,
      startingPoint: StartingPoint,
      finishingPoint: FinishingPoint,
    });

    const newTripSchedule = await tripSchedule.save();
    res.status(201).json(newTripSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: error.message });
  }
  res.send();
});

// update a user
route.put(
  "/trip-schedules/:id",
  [getTripScheduleMiddleware],
  async (req, res) => {
    const {
      Name,
      BusAccount,
      DaysRoutine,
      StartTime,
      EndTime,
      StartingPoint,
      FinishingPoint,
      Status,
    } = req.body;

    if (Name) res.tripSchedule.name = Name;
    if (BusAccount) res.tripSchedule.busAccount = BusAccount;
    if (DaysRoutine) res.tripSchedule.daysRoutine = DaysRoutine;
    if (StartTime) res.tripSchedule.startTime = StartTime;
    if (EndTime) res.tripSchedule.endTime = EndTime;
    if (StartingPoint) res.tripSchedule.startingPoint = StartingPoint;
    if (FinishingPoint) res.tripSchedule.finishingPoint = FinishingPoint;
    if (Status !== null) res.tripSchedule.status = Status;
    res.tripSchedule.dateModified = Date.now();

    try {
      const updateTripSchedule = await res.tripSchedule.save();
      res.status(200).json(updateTripSchedule);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error_message: error.message });
    }
  },
);

async function getTripScheduleMiddleware(req, res, next) {
  let tripSchedule;
  try {
    tripSchedule = await TripSchedule.findById(req.params.id);
    if (!tripSchedule)
      return res.status(404).json({ message: "Trip Schedule not found." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
  res.tripSchedule = tripSchedule;
  next();
}

module.exports = route;
