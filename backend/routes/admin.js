const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Order = require("../models/Order");
const TransporterVerification = require("../models/TransporterVerification");

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// ✅ GET all transporters (for verification list)
router.get("/transporters", auth, adminOnly, async (req, res) => {
  try {
    const transporters = await User.find({ role: "transporter" });
    res.json(transporters);
  } catch (err) {
    console.error("GET TRANSPORTERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ VERIFY / REJECT transporter
router.post("/transporters/:id/decision", auth, adminOnly, async (req, res) => {
  try {
    const transporterId = req.params.id;
    const adminId = req.user._id;


    const { aadhaarNumber, licenseNumber, remarks, status, rejectionReason } = req.body;

    if (!aadhaarNumber || !licenseNumber) {
      return res.status(400).json({ message: "Aadhaar and License are required" });
    }

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const record = await TransporterVerification.create({
      transporter: transporterId,
      verifiedBy: adminId,
      aadhaarNumber,
      licenseNumber,
      remarks: remarks || "",
      status,
      rejectionReason: status === "Rejected" ? (rejectionReason || remarks || "") : ""
    });

    await User.findByIdAndUpdate(transporterId, {
      verified: status === "Verified"
    });

    res.json({ message: `Transporter ${status}`, record });
  } catch (err) {
    console.error("TRANSPORTER DECISION ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ GET verification history
router.get("/verifications", auth, adminOnly, async (req, res) => {
  try {
    const history = await TransporterVerification.find()
      .populate("transporter", "name email")
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("VERIFICATION HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get PENDING orders that need transporter assignment
router.get("/orders/pending", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryStatus: "Pending" })
      .populate("buyer", "name email")
      .populate({
        path: "items.listing",
        select: "location pricePerLitre quantityLitres seller",
        populate: { path: "seller", select: "name email" }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET PENDING ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get only VERIFIED transporters
router.get("/transporters/verified", auth, adminOnly, async (req, res) => {
  try {
    const list = await User.find({ role: "transporter", verified: true })
      .select("name email verified");
    res.json(list);
  } catch (err) {
    console.error("GET VERIFIED TRANSPORTERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Assign transporter to an order
router.put("/orders/:orderId/assign", auth, adminOnly, async (req, res) => {
  try {
    const { transporterId } = req.body;
    if (!transporterId) return res.status(400).json({ message: "transporterId required" });

    const transporter = await User.findOne({
      _id: transporterId,
      role: "transporter",
      verified: true
    });

    if (!transporter) return res.status(400).json({ message: "Invalid transporter" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryStatus !== "Pending") {
      return res.status(400).json({ message: "Only Pending orders can be assigned" });
    }

    order.transporter = transporterId;
    order.deliveryStatus = "Assigned";
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
    console.error("ASSIGN TRANSPORTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
