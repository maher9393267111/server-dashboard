const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    imageUrl: String,
  },
  {
    query: {
      byName(name) {
        return this.where({ name: new RegExp(name, "i") });
      },
    },
  }
);

const Category = model("Category", categorySchema);
module.exports = Category;
