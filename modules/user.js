const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
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
    weightCategory: String, //overweight, normal, underweight
    ingredients: [String],
    foodHabits: [String],
})

//encrypt password using  bcrypt
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

//function to identify the weight of the users
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

//sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('user', UserSchema);