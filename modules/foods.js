const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    difficultyLevel: {
        type: String, 
        required: true
    },
    approximateTimeInMinutes: {
        type: Number, 
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    category: { // spicy, meaty, vegan, malay, fast food...
        type: String,
        required: true
    },
    steps: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema);