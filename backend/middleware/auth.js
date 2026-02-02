const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Your token stores { id, role }
    req.user = {
      _id: decoded.id,       // ✅ THIS FIXES verifiedBy
      role: decoded.role
    };

    if (!req.user._id) {
      return res.status(401).json({ message: "Token missing user id" });
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Expired JWT. Please login again." });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
