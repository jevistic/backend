const mongoose = require("mongoose");

// const Exercise = require("./Exercise")

const Schema = mongoose.Schema;

const User = new Schema({
  firstname: {
    type: String,
    trim: true,
    required: [true, "firstname is required"],
  },

  lastname: {
     type: String,
     trim: true,
     required: [true, "lastname is required"] 
 },

  email: {
    type: String,
    trim: true,
    required: [true, "email is required"],
    unique: [true, "email must me unique"],
  },

  phone: Number,
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "Password Must Be More Than Of 8 Char"],
  },
  dob: String,
  gender: String,

  exercises: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Exercise'
    }
  ]

});

module.exports = mongoose.model("user", User);
