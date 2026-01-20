const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController.js");
const { protect } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//protected route to get user profile
router.get("/profile", protect, getProfile);

module.exports = router;
