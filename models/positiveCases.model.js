const mongoose = require('mongoose')
const positiveCaseSchema = new mongoose.Schema({
    passengerAccount: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Passenger"
    },
    closeContacts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Passenger"
        }
    ],
    tripHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "ScannedQR"
        }
    ],
    status: {
        type: String,
        required: true,
        default: "Active"
    },
    dateTaggedAsPositive: {
        type: Date,
        null: true
    },
    dateModified: {
        type: Date,
        default: Date.now(),
        null: true
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('PositiveCase', positiveCaseSchema);