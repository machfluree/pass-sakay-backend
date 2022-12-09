const mongoose = require("mongoose");
const ScannedQrSchema = new mongoose.Schema({
  passengerId: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    required: true,
  },
  tripDate: {
    type: Date,
    required: true,
  },
  tripTimeStart: {
    type: Date,
    required: true,
  },
  tripTimeEnd: {
    type: Date,
    required: true,
  },
  tripRouteFrom: {
    type: String,
    required: true,
  },
  tripRouteTo: {
    type: String,
    required: true,
  },
  busName: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
  },
  busDriver: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ScannedQR", ScannedQrSchema);
