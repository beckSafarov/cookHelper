const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  asyncHandler = require('../middleware/async'),
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
    createdAt: {
      type: Date,
      default: Date.now(),
      },
    recommended: [Object],
    visitedFoods: [Object],
    favorites: [String],
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
UserSchema.pre('save', async function(req, res, next){
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
      
      //identify the difficulty level in numbers for the user
      if(this.experience === 'beginner'){
          level = 1; 
      }else if(this.experience === 'intermediate'){
          level = 2;
      }else{
        level = 3; 
      }
     
      //querying the database for the relevant meals 
      if(categories.length > 0){
        for(let i = 0; i<categories.length; i++){
          finalFoods.push({
             numericalDifficulty: level,
             category: categories[i]
          })
        }
      }else{
        finalFoods.push({
          numericalDifficulty: level,
          categories: undefined
        })
      }
      
      this.recommended = getUniqueObjectArray(finalFoods); 
    } 
    next();
});

UserSchema.methods.foodVisited = function(food){
  let previousObject = this.visitedFoods.find(function(object){
    return (object.category === food.category) ? object : false;
  })
  
   if(!previousObject){
      this.visitedFoods.push({
        category: food.category,
        count: 1
      });
     
   }else{
      previousObject.count++; 
      if(previousObject.count === 3){
        this.recommended.push({
          numericalDifficulty: food.numericalDifficulty,
          category: food.category
        });
        this.recommended = getUniqueObjectArray(this.recommended); 
      }
      this.visitedFoods.find(function(object){
        if(object.category === previousObject.category){
          object.count = previousObject.count; 
        }
      });
   }
  return this;  

}//end of the foodVisited function 



//sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//new food liked 
UserSchema.methods.foodLiked = function(food){
  const category = food.category; 
  const level = food.numericalDifficulty; 
  let recommended = this.recommended; 
  recommended.push({
    numericalDifficulty: level,
    category: category
  })
  this.recommended = getUniqueObjectArray(recommended); 
  this.favorites.push(food.id); 
  return this.recommended;
}

//food disliked
UserSchema.methods.foodUnliked = function(foodId){
  for(let i = 0; i<this.favorites.length; i++){
    if(foodId == this.favorites[i]){
      this.favorites.splice(i, 1); 
    }
  }
  return this.favorites; 
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


