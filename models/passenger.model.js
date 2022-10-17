const mongoose = require("mongoose");
const AddressModel = require("./address.model");
const passengerSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  currentAddress: {
    type: String,
    required: true,
  },
  homeAddress: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  dateModified: {
    type: Date,
    required: false,
  },
  dateAdded: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Passenger", passengerSchema);
