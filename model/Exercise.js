const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Exercise = new Schema({

  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },

  description: {
    trim: true,
    type: String,
  },

  type: {
    type: String,
    required: [true, "type is required"],
    enum: ["Walk", "Swim", "Hike", "Run", "Ride Bicycle"]
  },

  duration:{
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model("Exercise", Exercise);
