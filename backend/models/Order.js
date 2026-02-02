const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "WaterListing", required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    transporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
deliveryStatus: { type: String, enum: ["Pending", "Assigned", "Accepted", "InTransit", "Delivered"], default: "Pending" },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
