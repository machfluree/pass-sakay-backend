const mongoose = require("mongoose");

const dateInstance = new Date();
const year = dateInstance.getFullYear();
const month = (dateInstance.getMonth()+1).toString().padStart(2, '0');
const day= dateInstance.getDate().toString().padStart(2, "0");
const hour = dateInstance.getHours().toString().padStart(2, "0");
const minute = dateInstance.getMinutes().toString().padStart(2, "0");
const date = `${year}-${month}-${day}`

const ScannedQrSchema = new mongoose.Schema({
  passengerAccount: {
    type: mongoose.Schema.ObjectId,
    ref: "Passenger",
    required: true
  },
  busAccount: {
    type: mongoose.Schema.ObjectId,
    ref: "BusDriver",
    required: true
  },
  tripSched: {
    type: mongoose.Schema.ObjectId,
    ref: "TripSchedule",
    required: true
  },
  tripType: {
    type: String,
    // required: true,
    null: true,
  },
  landmark: {
    type: String,
    null: true,
  },
  landmarkOut: {
    type: String,
    null: true,
    default: null,
  },
  tripPlaceOfScan: {
    type: String,
    null: true,
  },
  tripPlaceOfScanOut: {
    type: String,
    null: true,
    default: null
  },
  temperature: {
    type: Number,
    null: true,
  },
  seatNumber: {
    type: String,
    null: true,
  },
  vaccineCode: {
    type: String,
    null: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  time: {
    type: Date,
    // required: true,
    null: true,
    // default: Date.now()
  },
  timeIn: {
    type: Date,
    // required: true,
    null: true,
    default: null
  },
  timeInStatus: {
    type: Boolean,
    null: true,
    default: null
  },
  timeOut: {
    type: Date,
    // required: true,
    null: true,
    default: null
  },
  timeOutStatus: {
    type: Boolean,
    // required: true,
    null: true,
    default: null
  },
});

module.exports = mongoose.model("ScannedQR", ScannedQrSchema);
