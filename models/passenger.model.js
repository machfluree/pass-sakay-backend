const mongoose = require('mongoose')
const AddressModel = require('./address.model')
const passengerSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    currentAddress: {
        type: AddressModel,
        required: true
    },
    homeAddress: {
        type: AddressModel,
        required: true
    },
    dateModified: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('Passenger', passengerSchema);