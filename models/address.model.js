const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    baranggay: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Address', addressSchema);