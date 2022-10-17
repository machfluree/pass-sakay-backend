const mongoose = require('mongoose')
const AddressModel = require('./address.model')
const passengerSchema = new mongoose.Schema({
    busName: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: false
    },
    inChargeOfAccount: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
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