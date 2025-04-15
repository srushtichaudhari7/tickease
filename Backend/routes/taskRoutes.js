import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  isEmployee,
  isAnyRole,
  isCustomer,
} from "../middleware/roleMiddleware.js";
import { UserType } from "../../Shared/user.types.js";
import { StatusType } from "../../Shared/status.type.js";

const router = express.Router();

// Get all tasks - different results based on role
router.get("/", authMiddleware, isAnyRole, async (req, res) => {
  try {
    let tasks = [];

    if (req.user.role === UserType.EMPLOYEE) {
      // Employees can see all tasks
      tasks = await Task.find()
        .populate("assignedTo", "name")
        .select("-__v")
        .sort({ createdAt: -1 });
    } else {
      // Customers see only their own tasks
      tasks = await Task.find({ userId: req.user.id })
        .populate("assignedTo", "name")
        .select("-__v")
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

// Create a new task - only employees can create tasks
router.post("/", authMiddleware, isEmployee, async (req, res) => {
  try {
    // Employee-only functionality to create tasks
    const { title, description, dueDate, assignedTo, priority, project } =
      req.body;

    // Validate request
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      userId: assignedTo, // The user the task is assigned to
      title,
      description,
      assignedTo,
      dueDate,
      priority: priority || "Medium",
      project,
      status: StatusType.TO_DO,
      createdBy: req.user.id, // The employee who created the task
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
});

// New endpoint: Create an issue - customers can use this endpoint
router.post("/issue", authMiddleware, isCustomer, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Validate request
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Create a new task with the current user as both userId and createdBy
    const newIssue = new Task({
      userId: req.user.id,
      title,
      description,
      priority: priority || "Medium",
      status: StatusType.TO_DO,
      createdBy: req.user.id,
      // No assignedTo yet - will be assigned by an employee later
    });

    // Save the issue
    const savedIssue = await newIssue.save();

    res.status(201).json({
      message: "Issue created successfully",
      issue: savedIssue,
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    res
      .status(500)
      .json({ message: "Error creating issue", error: error.message });
  }
});

// Update a task - role-based permissions
router.put("/:id", authMiddleware, isAnyRole, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the task first
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Role-based permission checks
    if (req.user.role === UserType.CUSTOMER) {
      // Customers can only update specific fields like status or comments
      // And only if they are the creator of the task
      if (task.userId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You don't have permission to update this task",
        });
      }

      const allowedUpdates = ["status", "comments"];
      const requestedUpdates = Object.keys(updates);

      const isValidOperation = requestedUpdates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(403).json({
          message: "You don't have permission to update these fields",
        });
      }
    }

    // Apply the updates
    Object.keys(updates).forEach((key) => {
      task[key] = updates[key];
    });

    // Save the updated task
    const updatedTask = await task.save();

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
});

// Delete a task - only employees can delete tasks
router.delete("/:id", authMiddleware, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
});

export default router;
