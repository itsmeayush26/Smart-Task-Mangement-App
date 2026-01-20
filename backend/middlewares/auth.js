const { verifyToken } = require("../config/jwt");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }
};

module.exports = { protect };
