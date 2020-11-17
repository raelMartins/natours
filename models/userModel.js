const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name '],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be more than 8 characters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: [8, 'Password must be more than 8 characters'],
    validate: {
      //This only works on CREATE or SAVE
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords must match'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
