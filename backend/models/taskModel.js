const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a task description"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"],
    },
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        message: "Priority must be High, Medium, or Low",
      },
      required: [true, "Please provide a priority level"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed"],
        message: "Status must be Pending or Completed",
      },
      default: "Pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


taskSchema.index({ userId: 1, status: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
