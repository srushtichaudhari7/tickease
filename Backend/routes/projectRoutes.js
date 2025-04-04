import express from "express";
import Project from "../models/ProjectModel.js";
import authMiddleware from "../middleware/authMiddleware.js";

const projectroute = express.projectroute();

// 🟢 Get all projects
projectroute.get("/", authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🟢 Get a single project by ID
projectroute.get("/:id", authmiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🔵 Create a new project
projectroute.post("/", authmiddleware, async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Project Name is required" });
    }

    try {
        const newProject = new Project({
            name,
            description,
            createdBy: req.user.id, // Assuming user ID is stored in token
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🟡 Update a project
projectroute.put("/:id", authmiddleware, async (req, res) => {
    const { name, description } = req.body;

    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.name = name || project.name;
        project.description = description || project.description;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🔴 Delete a project
projectroute.delete("/:id", authmiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.deleteOne();
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default projectroute;