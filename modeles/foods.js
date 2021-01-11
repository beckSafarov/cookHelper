const mongoose = require('mongoose');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug:String,
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
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    numericalDifficulty: {
        type: Number
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
    },
    likes: {
        type: Number,
        default: 0
    }
})

//NUMERICAL DIFFICULTY LEVEL OF A FOOD
foodSchema.pre('save', function(next){
    if(this.difficultyLevel === 'easy'){
        this.numericalDifficulty = 1;
    }else if(this.difficultyLevel === 'medium'){
        this.numericalDifficulty = 2; 
    }else{
        this.numericalDifficulty = 3;
    }
    next(); 
});

foodSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true}); 
    next(); 
});



foodSchema.methods.addLike = function(){
    this.likes++; 
    console.log(this.likes); 
}

foodSchema.methods.removeLike = function(){
    this.likes--; 
}

module.exports = mongoose.model('food', foodSchema);