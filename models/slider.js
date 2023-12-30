const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sliderSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Slider = model("Slider", sliderSchema);
module.exports = Slider;
