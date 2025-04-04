import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import MemberModel from "../models/MemberModel.js";

const memberRoute = express.Router();

// 🟢 Get all members
memberRoute.get("/", authMiddleware, async (req, res) => {
    try {
        const members = await MemberModel.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🟢 Get a single member by ID
memberRoute.get("/:id", authMiddleware, async (req, res) => {
    try {
        const member = await MemberModel.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🔵 Create a new member
memberRoute.post("/", authMiddleware, async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    try {
        const newMember = new MemberModel({
            name,
            email,
            addedBy: req.user.id, // who added the member
        });

        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        console.error(error.message); // log the real issue in backend terminal
        res.status(500).json({ message: "Server Error" });
    }
});

// 🟡 Update a member
memberRoute.put("/:id", authMiddleware, async (req, res) => {
    const { name, email } = req.body;

    try {
        let member = await MemberModel.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        member.name = name || member.name;
        member.email = email || member.email;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 🔴 Delete a member
memberRoute.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const member = await MemberModel.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        await member.deleteOne();
        res.json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default memberRoute;
