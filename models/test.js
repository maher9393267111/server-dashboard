const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const testSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Test = model("test", testSchema);
module.exports = Test;
