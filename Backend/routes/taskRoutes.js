import express from "express"
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).populate("projectId assigneeId");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
});

// 📌 Update task status
// Update a task only if it belongs to the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

        if (!task) return res.status(404).json({ error: "Task not found" });

        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// Delete a task only if it belongs to the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

// ✅ Named Export
export default router;
