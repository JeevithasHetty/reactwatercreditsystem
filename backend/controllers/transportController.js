import User from "../models/User.js";

// Fetch all transporters
export const getAllTransporters = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const transporters = await User.find({ role: "transporter" });
    res.json(transporters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify transporter
export const verifyTransporter = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const transporter = await User.findById(req.params.id);
    if (!transporter) return res.status(404).json({ message: "Transporter not found" });

    transporter.status = "Verified";
    await transporter.save();

    res.json({ message: "Transporter verified", transporter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
