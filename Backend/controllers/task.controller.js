import Task from "../models/task.model.js";
import User from "../models/users.model.js";

// Create Task (Admin/Manager)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, category } = req.body;
    const { _id, organization, role } = req.user;

    // assignedTo should be an array of user IDs
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res.status(400).json({ message: "assignedTo must be a non-empty array of user IDs" });
    }

    // Only assign to users in same org
    const assignees = await User.find({ _id: { $in: assignedTo }, organization });
    if (assignees.length !== assignedTo.length) {
      return res.status(400).json({ message: "One or more assignees not found in your organization" });
    }

    // RBAC: Manager can only assign to members
    if (
      role === "manager" &&
      assignees.some((user) => user.role !== "member")
    ) {
      return res.status(403).json({ message: "Managers can only assign tasks to members" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      category,
      organization,
      createdBy: _id,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Tasks (Org Isolation)
export const getTasks = async (req, res) => {
  try {
    const { organization } = req.user;
    const tasks = await Task.find({ organization }).populate("assignedTo", "name email role");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Task Status (Member: only own tasks, Manager/Admin: any in org)
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { _id, organization, role } = req.user;

    // Validate status
    const allowedStatuses = ["todo", "in-progress", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findOne({ _id: id, organization });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Member: can only update their own tasks
    if (
      role === "member" &&
      !task.assignedTo.some((userId) => String(userId) === String(_id))
    ) {
      return res.status(403).json({ message: "Members can only update their own tasks" });
    }

    // Update and return the updated task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, organization },
      { status },
      { new: true }
    ).populate("assignedTo", "name email role");

    res.json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { organization } = req.user;

    const task = await Task.findOneAndDelete({ _id: id, organization });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};