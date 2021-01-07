const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  Foods = require('./foods.js'),
  {
    getUniqueArray, getUniqueObjectArray
  } = require('../utils/userCtrlHelpers'),
  crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [30, 'Name cannot be more than 30 characters'],
      },
    slug: String,
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
        select: false
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    numericalExperience: {
        type:Number,
        enum: [1, 2, 3]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      },
    recommended: [Object],
    ingredients: [Object]
})

//ENCRYPT PASSWORDS USING BECRYPT
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;
});

//match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


//RETURN THE WEIGHT OF THE USER 
UserSchema.statics.getWeightCategory = function(height, weight){
  let weightCategory; 
  height = height/100;
  const bmi = weight/(height*height);

  if(bmi >= 18.5 && bmi <= 24.9){
    weightCategory = 'normal';
  } else if(bmi < 18.5){
    weightCategory = 'underweight';
  }else{
    weightCategory = 'overweight';
  }

  return weightCategory; 
}

//INITIAL RECOMMENDED FOODS LIST MAKER 
UserSchema.pre('save', async function(){
    if(this.recommended.length === 0){
      const weightCategory = this.constructor.getWeightCategory(this.height, this.weight); 
      let categories = [];
      let level; 
      let finalFoods = this.recommended; 
     
      //choosing recommended food categories based on weight
      if(weightCategory == 'underweight'){
        categories.push('fast-food', 'meaty', 'high-carb', 'sweet');
      }else if(weightCategory == 'overwheight'){
        categories.push('low-fat', 'vegetarian');
      }
      
      //identify the difficulty level for the user
      if(this.experience === 'beginner'){
          level = 'easy'; 
      }else if(this.experience === 'intermediate'){
          level = 'medium';
      }else{
        level = 'hard'; 
      }
     
      //querying the database for the relevant meals 
      if(categories.length > 0){
        for(let i = 0; i<categories.length; i++){
          finalFoods.push({
             difficultyLevel: level,
             category: categories[i]
          })
        }
       
      }else{
        finalFoods.push({
          difficultyLevel: level,
          categories: undefined
        })
      }
      
      this.recommended = getUniqueObjectArray(finalFoods);
    }

    
});

//NUMERICAL EXPERIENCE 
UserSchema.pre('save', function(){
    let numbers = [1, 2, 3]; 
    let words = ['beginner', 'intermediate', 'advanced']; 
    for(let i = 0; i<words.length; i++){
      if(this.experience === words[i]){
        this.numericalExperience = numbers[i];
      }
    }
});

//sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//new food liked 
UserSchema.methods.foodLiked = function(category, level){
  let recommended = this.recommended; 
  recommended.push({
    difficultyLevel: level,
    category: category
  })
  this.recommended = getUniqueObjectArray(recommended); 
  return this.recommended;
}


//ADDS LIST OF INGREDIENTS TO THE INGREDIENTS ARRAY
UserSchema.methods.addToIngredients = function(ingredients){
  this.ingredients = this.ingredients.concat(ingredients); 
  return this.ingredients;
}

//REMOVES ONE INGREDIENT FROM THE INGREDIENT ARRAY
UserSchema.methods.removeFromIngredients = function(ingredient, foodName){
  let ingredients = this.ingredients; 
  ingredients.forEach(function(listIngredient, index){
      if(listIngredient.ingredient === ingredient && listIngredient.food === foodName){
            ingredients.splice(index, 1); 
      }
  });
  this.ingredients = ingredients; 
  return this.ingredients; 
}

//REMOVES ALL INGREDIENTS FROM THE INGREDIENT ARRAY
UserSchema.methods.flushIngredients = function(ingredient, foodName){
  this.ingredients = []; 
  return this.ingredients; 
}

module.exports = mongoose.model('user', UserSchema);
