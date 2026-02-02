import User from "../models/User.js";

// Get all transporters
export const getTransporters = async (req, res) => {
  try {
    const transporters = await User.find({ role: "transporter" });
    res.json(transporters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify transporter
export const verifyTransporter = async (req, res) => {
  const { transporterId } = req.body;
  try {
    const transporter = await User.findById(transporterId);
    if (!transporter) return res.status(404).json({ message: "Transporter not found" });

    transporter.verified = true;
    await transporter.save();
    res.json({ message: "Transporter verified", transporter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
