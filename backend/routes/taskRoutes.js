const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAnalytics,
} = require("../controllers/taskController.js");
const { protect } = require("../middlewares/auth.js");

const router = express.Router();

router.use(protect);

router.get("/analytics/dashboard", getAnalytics);

// diff task routes
router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
