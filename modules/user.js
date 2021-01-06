const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  Foods = require('./foods.js'),
  {getUniqueArray} = require('../utils/userCtrlHelpers'),
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
    createdAt: {
      type: Date,
      default: Date.now(),
      },

    weightCategory: String, //overweight, normal, underweight
    recommended: [Object],
    ingredients: [Object],
    foodHabits: [String],
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


//IDENTIFY THE BMI OF THE USERS
UserSchema.pre('save', function(){
  const height = this.height/100;
  const weight = this.weight;
  const bmi = weight/(height*height);

  if(bmi >= 18.5 && bmi <= 24.9){
    this.weightCategory = 'normal';
  } else if(bmi < 18.5){
    this.weightCategory = 'underweight';
  }else{
    this.weightCategory = 'overweight';
  }
});

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
    const weightCategory = this.constructor.getWeightCategory(this.height, this.weight); 
    let categories = [];
    let level; 
    let finalFoods = []; 

    //choosing recommended food categories based on weight
    if(weightCategory == 'underweight'){
      categories.push('fast-food', 'meaty', 'high-carb', 'sweet');
    }else if(weightCategory == 'overwheight'){
      categories.push('low-fat', 'vegetarian');
    }
    
    //identify the difficulty level for the user
    if(this.experience === 'beginner'){
        level = 'easy'; 
    }else if(this.experience === 'medium'){
        level = 'medium';
    }else{
      level = 'hard'; 
    }

    //querying the database for the relevant meals 
    if(categories.length > 0){
        for(let i = 0; i<categories.length; i++){
           let food = await Foods.find({category: categories[i], difficultyLevel: level});
           food.forEach(function(){
             finalFoods = finalFoods.concat(food); 
           });
        }
    }else{
       let food = await Foods.find({difficultyLevel: level}); 
       finalFoods = finalFoods.concat(food); 
    }

    this.recommended = this.recommended.concat(finalFoods); 
    console.log('it should work'); 
});

//sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//GENERATE ARRAY WITH RECOMMENDED FOODS
UserSchema.methods.featuredFoods = async function () {
  let categories = [];
  let foods = [];
  
  //choosing recommended food categories based on weight
  if(this.weightCategory == 'underweight'){
    categories.push('fast-food', 'meaty');
  }else if(this.weightCategory == 'overwheight'){
    categories.push('low-fat', 'vegetarian');
  }

  //adding those categories to the food array
  if(categories.length > 0){
    for(let i = 0; i<categories.length; i++){
      let food = await Foods.find({category: categories[i]}).exec();
      for(let y = 0; y<food.length; y++){
        foods.push(food[y]);
      }
    }
  }else{
    let food = await Foods.find().exec();
    for(let y = 0; y<food.length; y++){
      foods.push(food[y]);
    }
    foods.push(food);
  }

  return foods;
};

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
