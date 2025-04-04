import express from "express"
import Task from "../models/Task.js";

const router = express.Router();

// 📌 Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().populate("projectId assigneeId");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
});

// 📌 Create a new task
router.post("/", async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Update task status
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Delete task
router.delete("/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Named Export
export default router;
