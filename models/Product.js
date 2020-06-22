//Products model
const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategories: {
    type: [String],
  },
  stockCount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "No description",
  },
});

module.exports = mongoose.model("products", ProductSchema);
