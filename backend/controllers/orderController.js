const Order = require("../models/Order");

// Buyer orders
exports.getBuyerOrders = async (req, res) => {
  const orders = await Order.find({ buyerId: req.user.id })
    .populate("items.listingId");
  res.json(orders);
};

// Seller orders
exports.getSellerOrders = async (req, res) => {
  const orders = await Order.find({ sellerId: req.user.id })
    .populate("items.listingId");
  res.json(orders);
};

// Update status (Seller)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });

  order.status = status;
  await order.save();

  res.json(order);
};
