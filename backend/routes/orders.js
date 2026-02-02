// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const WaterListing = require("../models/WaterListing");

// ===============================
// CREATE ORDER (CHECKOUT)
// ===============================
router.post("/", auth, async (req, res) => {
  try {
    const buyerId = req.user._id;   // ✅ now defined
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const formattedItems = [];

    for (const item of items) {
      const listingDoc = await WaterListing.findById(item.listing);

      if (!listingDoc) {
        return res.status(404).json({ message: "Listing not found" });
      }

      totalAmount += listingDoc.pricePerLitre * item.quantity;

      formattedItems.push({
        listing: listingDoc._id,   // ✅ REQUIRED FOR SELLER ORDERS
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      buyer: buyerId,              // ✅ FIXED
      items: formattedItems,       // ✅ FIXED
      totalAmount,
      status: "Pending"
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ===============================
// BUYER ORDERS
// ===============================
router.get("/buyer", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("items.listing")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("BUYER ORDERS ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ===============================
// SELLER ORDERS
// ===============================
router.get("/seller", auth, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // get seller listings
    const listings = await WaterListing.find({ seller: sellerId }).select("_id");
    const listingIds = listings.map(l => l._id);

    const orders = await Order.find({
      "items.listing": { $in: listingIds }
    })
      .populate("items.listing")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("SELLER ORDERS ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
