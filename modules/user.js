const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [30, 'Name cannot be more than 30 characters'],
      },
    slug: String,
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, 
    },
    weight: {
        type: Number, 
        required: true
    },
    height: {
        type: Number, 
        required: true
    },
    weightCategory: String, //overweight, normal, underweight
    ingredients: [String],
    foodHabits: [String],
})

module.exports = mongoose.model('user', userSchema);