const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exercisesSchema = new Schema({

  name: {
    type: String,
    required: [true, "name is required"],
  },

  description: {
     type: String,
     required: [true, "description is required"] 
 },

  type: {
    type: String,
    required: [true, "type is required"],
  },

  duration: Number,

  date: {
    type: String,
    required: [true, "date is required"],
  }

});

module.exports = mongoose.model("exercises", exercisesSchema);
