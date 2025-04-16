import express from "express";
import Task from "../models/Task.js";
import Ticket from "../models/Ticket.js"; // Import the new Ticket model
import authMiddleware from "../middleware/authMiddleware.js";
import {
  isEmployee,
  isAnyRole,
  isCustomer,
} from "../middleware/roleMiddleware.js";
import  UserType  from "../../Shared/user.types.js";
import  StatusType  from "../../Shared/status.type.js";

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

// Get tickets created by the logged-in customer
router.get("/my-tickets", authMiddleware, isCustomer, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    res
      .status(500)
      .json({ message: "Error fetching customer tickets", error: error.message });
  }
});


// Get customer tickets - only for employees
router.get("/customer-tickets", authMiddleware, isEmployee, async (req, res) => {
  try {
    // Find tickets created by customers
    const tickets = await Ticket.find()
      .populate("createdBy", "name email") // Populate the user who created the ticket
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    res
      .status(500)
      .json({ message: "Error fetching customer tickets", error: error.message });
  }
});

// Get individual task by ID
router.get('/:id', authMiddleware, isAnyRole, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .select('-__v');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Role-based access check
    if (req.user.role === UserType.CUSTOMER && task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get individual ticket by ID
router.get('/ticket/:id', authMiddleware, isAnyRole, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .select('-__v');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    // Role-based access check
    if (req.user.role === UserType.CUSTOMER && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Convert customer ticket to task
router.put("/convert-ticket/:id", authMiddleware, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, priority, project, dueDate } = req.body; // Get necessary details for task creation

    // Find the original ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!assignedTo) {
        return res.status(400).json({ message: "assignedTo is required to convert a ticket to a task" });
    }

    // Create a new task based on the ticket information
    const newTask = new Task({
      userId: assignedTo, // The user the task is assigned to
      title: ticket.title,
      description: ticket.description,
      assignedTo: assignedTo,
      dueDate: dueDate, // Optional: pass from request or set default
      priority: priority || ticket.priority, // Use ticket priority or request priority
      project: project, // Optional: pass from request
      status: StatusType.TO_DO, // Default status for new task
      createdBy: req.user.id, // Employee who converted the ticket
      // Optional: Link back to the original ticket ID if needed
      // originalTicketId: ticket._id,
    });

    const savedTask = await newTask.save();

    // Update the original ticket's status to 'Converted to Task'
    ticket.status = StatusType.CONVERTED_TO_TASK;
    await ticket.save();

    // Optional: Delete the original ticket after conversion
    // await Ticket.findByIdAndDelete(id);

    res.json({
      message: "Ticket converted to task successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error converting ticket:", error);
    res
      .status(500)
      .json({ message: "Error converting ticket", error: error.message });
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

// New endpoint: Create an issue (Ticket) - customers can use this endpoint
router.post("/issue", authMiddleware, isCustomer, async (req, res) => {
  try {
    // Priority removed from customer input
    const { title, description } = req.body;

    // Validate request
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Create a new Ticket
    const newTicket = new Ticket({
      title,
      description,
      // Priority defaults to 'Medium' based on the schema
      status: StatusType.TO_DO, // Default status for new ticket
      createdBy: req.user.id, // The customer who created the ticket
    });

    // Save the ticket
    const savedTicket = await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: savedTicket, // Return the saved ticket
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res
      .status(500)
      .json({ message: "Error creating ticket", error: error.message });
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

// Update task status - specific endpoint for status changes
router.put("/:id/status", authMiddleware, isAnyRole, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !Object.values(StatusType).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Role-based permission checks
    if (req.user.role === UserType.CUSTOMER) {
      // Customers can only update tasks they created
      if (task.userId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You don't have permission to update this task",
        });
      }
    }

    // Update the status
    task.status = status;
    const updatedTask = await task.save();

    res.json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
});

// Update ticket status - specific endpoint for customers to close/re-raise their tickets
router.put("/tickets/:id/status", authMiddleware, isCustomer, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status - Allow only 'Closed' or 'To do' (for re-raising)
    if (!status || ![StatusType.CLOSED, StatusType.TO_DO].includes(status)) {
      return res.status(400).json({ message: "Invalid status update for ticket. Allowed: Closed, To do" });
    }

    // Find the ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Permission check: Ensure the customer owns the ticket
    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You don't have permission to update this ticket's status",
      });
    }

    // Additional logic: Prevent closing if not 'Completed' or re-opening if not 'Closed'
    // (Assuming 'Completed' status is set by employees when resolving)
    // For now, we allow direct closing/re-opening by customer as per request

    // Update the status
    ticket.status = status;
    const updatedTicket = await ticket.save();

    res.json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res
      .status(500)
      .json({ message: "Error updating ticket status", error: error.message });
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
