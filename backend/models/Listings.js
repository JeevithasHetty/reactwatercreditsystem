const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  waterType: String,
  quantity: Number,
  pricePerLiter: Number,
  location: String,
  status: {
    type: String,
    default: "available"
  }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
