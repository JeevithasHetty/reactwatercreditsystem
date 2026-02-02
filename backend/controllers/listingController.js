const WaterListing = require("../models/WaterListing");

exports.createListing = async (req, res) => {
  const { location, pricePerLitre, quantityLitres } = req.body;
  try {
    const listing = await WaterListing.create({
      seller: req.user.id,
      location,
      pricePerLitre,
      quantityLitres,
    });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const listings = await WaterListing.find().populate("seller", "name email");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
