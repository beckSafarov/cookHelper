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

module.exports = mongoose.model('user', UserSchema);