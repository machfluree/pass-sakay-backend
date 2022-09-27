const mongoose = require('mongoose')
const userCategorySchema = new mongoose.Schema({
    categoryName: {
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

module.exports = mongoose.model('Accounts', userCategorySchema);