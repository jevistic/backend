const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "firstname is required"],
  },

  lastname: {
     type: String,
     required: [true, "lastname is required"] 
 },

  email: {
    type: String,
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
});

module.exports = mongoose.model("users", usersSchema);
