import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { isEmployee, isCustomer } from "../middleware/roleMiddleware.js";
import UserType  from "../../Shared/user.types.js";
import  StatusType  from "../../Shared/status.type.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/ProjectModel.js";

const router = express.Router();

// Get dashboard data - available to both roles but with filtered data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const response = {
      tasks: [],
      projects: [],
    };

    if (req.user.role === UserType.EMPLOYEE) {
      response.tasks = await Task.find({ userId: req.user.id });
      response.projects = await Project.find({ members: req.user.id });
      response.members = await User.find();
    } else {
      response.tasks = await Task.find({
        $or: [
          { assignedTo: req.user.id },
          { userId: req.user.id }
        ]
      });
      response.projects = await Project.find({
        members: req.user.id
      });
    }

    res.json(response);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Employee-only routes - returns employee-specific stats
router.get("/employee-stats", authMiddleware, isEmployee, async (req, res) => {
  try {
    // Get total tasks assigned to employee
    const totalTasks = await Task.countDocuments({ userId: req.user.id });
    
    // Get completed tasks count
    const completedTasks = await Task.countDocuments({
      userId: req.user.id,
      status: StatusType.COMPLETED
    });

    // Get pending projects count
    const pendingProjects = await Project.countDocuments({
      members: req.user.id,
      status: { $ne: StatusType.COMPLETED }
    });

    const stats = {
      totalTasks,
      completedTasks,
      pendingProjects
    };

    res.json({ employeeStats: stats });
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Customer-only routes - returns customer-specific stats
router.get("/customer-stats", authMiddleware, isCustomer, (req, res) => {
  const stats = {
    activeProjects: sampleData.projects.filter(
      (project) => project._id === "1" || project._id === "3"
    ).length,
    pendingTasks: sampleData.tasks.filter(
      (task) =>
        task.assignedTo === "Customer" && task.status !== StatusType.COMPLETED
    ).length,
    completedMilestones: 8,
    supportTickets: [
      { id: "ST-001", status: "Open", priority: "High" },
      { id: "ST-002", status: "Closed", priority: "Medium" },
    ],
  };

  res.json({ customerStats: stats });
});

export default router;
