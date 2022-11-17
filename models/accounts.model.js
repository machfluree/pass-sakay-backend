const mongoose = require('mongoose')
const accountSchema = new mongoose.Schema({
    _userID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    userRole: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
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
        required: true,
        default: Date.now(),
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now()
    },
});

module.exports = mongoose.model('Accounts', accountSchema);