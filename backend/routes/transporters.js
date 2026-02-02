const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Order = require("../models/Order");

// ✅ Transporter sees assigned orders
router.get("/orders", auth, async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ message: "Transporter only" });
    }

    const orders = await Order.find({
      transporter: req.user._id,
      deliveryStatus: { $in: ["Assigned", "Accepted", "InTransit"] }
    })
      .populate("buyer", "name email")
      .populate({
        path: "items.listing",
        select: "location pricePerLitre quantityLitres seller",
        populate: { path: "seller", select: "name email" }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("TRANSPORTER GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Transporter updates status
router.put("/orders/:orderId/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ message: "Transporter only" });
    }

    const { deliveryStatus } = req.body;
    const allowed = ["Accepted", "InTransit", "Delivered"];
    if (!allowed.includes(deliveryStatus)) {
      return res.status(400).json({ message: "Invalid deliveryStatus" });
    }

    const order = await Order.findOne({ _id: req.params.orderId, transporter: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Simple safe transitions (prevents jumping backwards)
    const nextAllowed = {
      Assigned: ["Accepted"],
      Accepted: ["InTransit"],
      InTransit: ["Delivered"]
    };

    const current = order.deliveryStatus;
    if (!nextAllowed[current] || !nextAllowed[current].includes(deliveryStatus)) {
      return res.status(400).json({ message: `Cannot move from ${current} to ${deliveryStatus}` });
    }

    order.deliveryStatus = deliveryStatus;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("buyer", "name email")
      .populate("transporter", "name email")
      .populate({
        path: "items.listing",
        select: "location pricePerLitre quantityLitres seller",
        populate: { path: "seller", select: "name email" }
      });

    res.json(populated);
  } catch (err) {
    console.error("TRANSPORTER UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
