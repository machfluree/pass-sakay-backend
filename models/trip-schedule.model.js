const mongoose = require('mongoose')
const tripScheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    busAccount: {
        type: mongoose.Schema.ObjectId,
        ref: "BusDriver",
    },
    daysRoutine: {
        type: Array,
        required: false,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    startingPoint: {
        type: String,
        required: true,
    },
    finishingPoint: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
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

module.exports = mongoose.model('TripSchedule', tripScheduleSchema);