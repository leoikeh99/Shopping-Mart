//Products model
const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategories: {
    type: [String],
    default: [],
  },
  stockCount: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "https://image.flaticon.com/icons/png/512/14/14611.png",
  },
  desc: {
    type: String,
    default: "No description",
  },
});

module.exports = mongoose.model("products", ProductSchema);
