const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model("cart", CartSchema);
