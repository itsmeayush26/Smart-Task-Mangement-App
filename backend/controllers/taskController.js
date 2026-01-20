// backend/controllers/taskController.js
const Task = require("../models/taskModel.js");

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    // Validation
    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// @desc    Get all tasks with search, filter, and sort
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sortBy } = req.query;

    // Build query
    let query = { userId: req.user._id };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy === "dueDate") {
      sortOptions.dueDate = 1; // Ascending
    } else if (sortBy === "priority") {
      // Custom priority sort: High -> Medium -> Low
      sortOptions.priority = 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// @desc    Get task analytics
// @route   GET /api/tasks/analytics/dashboard
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Priority Distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Status Distribution
    const statusDistribution = await Task.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Upcoming Deadlines (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingDeadlines = await Task.find({
      userId: userId,
      dueDate: { $gte: today, $lte: nextWeek },
      status: "Pending",
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Total tasks
    const totalTasks = await Task.countDocuments({ userId: userId });
    const completedTasks = await Task.countDocuments({
      userId: userId,
      status: "Completed",
    });
    const pendingTasks = await Task.countDocuments({
      userId: userId,
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate:
          totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
        priorityDistribution,
        statusDistribution,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAnalytics,
};
