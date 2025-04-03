import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Middleware to get user ID from token

const router = express.Router();

// Get employee dashboard data
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await Task.find({ assignedTo: userId });
        const projects = await Project.find({ members: userId });
        const members = await User.find(); // Get all users (or filter by team)

        // Task statistics
        const totalTasks = tasks.length;
        const assignedTasks = tasks.filter(task => task.status !== "completed").length;
        const completedTasks = tasks.filter(task => task.status === "completed").length;
        const incompleteTasks = totalTasks - completedTasks;
        const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date()).length;

        res.json({
            tasks,
            projects,
            members,
            stats: { totalTasks, assignedTasks, completedTasks, incompleteTasks, overdueTasks }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;