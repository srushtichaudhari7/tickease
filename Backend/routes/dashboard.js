import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { isEmployee, isCustomer } from "../middleware/roleMiddleware.js";
import { UserType } from "../../Shared/user.types.js";
import { StatusType } from "../../Shared/status.type.js";

const router = express.Router();

// Sample data - in a production app, this would come from a database
const sampleData = {
  tasks: [
    {
      _id: "1",
      title: "Complete project plan",
      status: StatusType.IN_PROGRESS,
      dueDate: "2025-04-20",
      priority: "High",
      assignedTo: "John Doe",
    },
    {
      _id: "2",
      title: "Review code changes",
      status: StatusType.TO_DO,
      dueDate: "2025-04-18",
      priority: "Medium",
      assignedTo: "Jane Smith",
    },
    {
      _id: "3",
      title: "Deploy beta version",
      status: StatusType.COMPLETED,
      dueDate: "2025-04-10",
      priority: "High",
      assignedTo: "Mike Johnson",
    },
    {
      _id: "4",
      title: "Approve design mockups",
      status: StatusType.TO_DO,
      dueDate: "2025-04-19",
      priority: "Low",
      assignedTo: "Customer",
    },
    {
      _id: "5",
      title: "Provide feedback",
      status: StatusType.IN_PROGRESS,
      dueDate: "2025-04-17",
      priority: "Medium",
      assignedTo: "Customer",
    },
  ],
  projects: [
    {
      _id: "1",
      name: "Website Redesign",
      description: "Redesign the company website",
    },
    {
      _id: "2",
      name: "Mobile App Development",
      description: "Create a mobile app for iOS and Android",
    },
    {
      _id: "3",
      name: "CRM Integration",
      description: "Integrate our systems with the new CRM",
    },
    {
      _id: "4",
      name: "E-commerce Platform",
      description: "Build new online store with payment processing",
    },
  ],
  members: [
    { _id: "1", name: "John Doe", email: "john@example.com", department: "IT" },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Design",
    },
    {
      _id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      department: "Development",
    },
    {
      _id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      department: "QA",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "Scheduled maintenance on April 20th",
      date: "Apr 13, 2025",
      content: "The system will be down for maintenance from 2-4 AM EST.",
    },
    {
      id: 2,
      title: "New features released!",
      date: "Apr 10, 2025",
      content:
        "We've added a new calendar view and improved task filtering options.",
    },
    {
      id: 3,
      title: "Team meeting reminder",
      date: "Apr 15, 2025",
      content: "Don't forget the quarterly team meeting this Friday at 10 AM.",
    },
  ],
};

// Get dashboard data - available to both roles but with filtered data
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Base response structure from our sample data
    const response = {
      tasks: [],
      projects: [],
      announcements: sampleData.announcements,
    };

    // Filter data based on role
    if (req.user.role === UserType.EMPLOYEE) {
      // Employees see all data
      response.tasks = sampleData.tasks;
      response.projects = sampleData.projects;
      response.members = sampleData.members;
    } else {
      // Customers only see their own tasks and relevant projects
      response.tasks = sampleData.tasks.filter(
        (task) =>
          task.assignedTo === "Customer" || task._id === "4" || task._id === "5"
      );
      response.projects = sampleData.projects.filter(
        (project) => project._id === "1" || project._id === "3"
      );
    }

    res.json(response);
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Employee-only routes - returns employee-specific stats
router.get("/employee-stats", authMiddleware, isEmployee, (req, res) => {
  const stats = {
    totalTasks: sampleData.tasks.length,
    completedTasks: sampleData.tasks.filter(
      (task) => task.status === StatusType.COMPLETED
    ).length,
    pendingProjects: sampleData.projects.length,
    teammatePerformance: [
      { name: "John", tasksCompleted: 12, tasksInProgress: 3 },
      { name: "Jane", tasksCompleted: 8, tasksInProgress: 5 },
      { name: "Mike", tasksCompleted: 15, tasksInProgress: 2 },
    ],
  };

  res.json({ employeeStats: stats });
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
