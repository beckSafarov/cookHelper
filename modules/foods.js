const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
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
    category: { // spicy, meaty, vegan, fast food...
        type: String,
        required: true
    },
    steps: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema);