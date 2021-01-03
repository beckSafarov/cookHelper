const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    photoLink: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String, 
        required: true
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
    amount: {
        type: [String],
        required: true
    },
    category: { // spicy, meaty, vegan, fast food...
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    steps: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('food', foodSchema);