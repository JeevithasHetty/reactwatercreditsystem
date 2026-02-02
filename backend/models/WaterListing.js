const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: String,
  pricePerLitre: Number,
  quantityLitres: Number,
});

module.exports = mongoose.model("WaterListing", listingSchema);
