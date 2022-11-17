const mongoose = require('mongoose')
const AddressModel = require('./address.model')
const busDriverSchema = new mongoose.Schema({
    busName: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    busProvince: {
        type: String,
        required: false
    },
    operatorFullName: {
        type: String,
        required: true
    },
    operatorPosition: {
        type: String,
        required: true
    },
    operatorPhoneNumber: {
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
        required: false,
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('BusDriver', busDriverSchema);