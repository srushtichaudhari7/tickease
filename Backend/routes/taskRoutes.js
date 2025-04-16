import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  isEmployee,
  isAnyRole,
  isCustomer,
} from "../middleware/roleMiddleware.js";
import  UserType  from "../../Shared/user.types.js";
import  StatusType  from "../../Shared/status.type.js";

const router = express.Router();

// 📌 Fetch all tasks
router.get("/", authMiddleware ,async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).populate("projectId", "name").populate("assigneeId");
        res.json(tasks);
    } catch (error) {

        let hehe = "Error fetching tasks";
        res.status(500).json ({ hehe });
    } 
});
// Create Task (for logged-in user)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, projectId, assigneeId, dueDate, status } = req.body;

        const newTask = new Task({
            userId: req.user.id, // Store the logged-in user's ID
            title,
            projectId,
            assigneeId,
            dueDate,
            status
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

// Update task status - specific endpoint for status changes
// Get chat history for a task
router.get('/:id/chat', authMiddleware, isAnyRole, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).select('chatHistory');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === UserType.CUSTOMER && task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task.chatHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Chatbot endpoint for task-related questions
router.post('/:id/chat', authMiddleware, isCustomer, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Simple FAQ-based response system
    const faq = {
      'status': `Current status: ${task.status}. Last updated: ${task.updatedAt.toLocaleDateString()}`,
      'due date': `Due date: ${task.dueDate?.toLocaleDateString() || 'Not set'}`,
      'assigned to': `Assigned to: ${task.assignedTo?.name || 'Unassigned'}`,
      'priority': `Priority: ${task.priority}`
    };

    const message = req.body.message.toLowerCase();
    const reply = Object.keys(faq).find(key => message.includes(key)) 
      ? faq[Object.keys(faq).find(key => message.includes(key))]
      : 'Please contact support for more specific questions';

    // Save conversation history
    task.chatHistory = task.chatHistory || [];
    task.chatHistory.push({
      question: message,
      response: reply,
      timestamp: new Date()
    });

    await task.save();

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Chat service unavailable', error: error.message });
  }
});

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
