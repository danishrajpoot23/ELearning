const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({ message: "Admin account is inactive" });
    }

    req.admin = admin; // 👈 now available in next routes
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authAdmin;
