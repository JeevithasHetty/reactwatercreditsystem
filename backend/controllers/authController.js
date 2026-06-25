const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TV = require("../models/TransporterVerification");

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  verified: user.verified,
  availability: user.availability,
  liveLocation: user.liveLocation,
  rejectionReason: user.rejectionReason,
  badge: user.badge,
  createdAt: user.createdAt,
});


// ======================
// SIGNUP
// ======================
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      aadhaarNumber,
      licenseNumber,
      vehicleType,
      vehicleCapacity,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!["buyer", "seller", "transporter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // ===========================
    // Transporter Verification
    // ===========================
    if (role === "transporter") {
      if (!aadhaarNumber || !licenseNumber) {
        await User.findByIdAndDelete(user._id);

        return res.status(400).json({
          success: false,
          message: "Aadhaar Number and License Number are required",
        });
      }

      await TV.create({
        transporter: user._id,
        aadhaarNumber,
        licenseNumber,
        vehicleType: vehicleType || "Tanker",
        vehicleCapacity: vehicleCapacity || 0,
        status: "Pending",
      });
    }

    return res.status(201).json({
      success: true,
      token: sign(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    console.error("Signup Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================
// LOGIN
// ======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.json({
      success: true,
      token: sign(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================
// GET CURRENT USER
// ======================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("GetMe Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = {
  signup,
  login,
  getMe,
};