import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Signup Route
// Signup Route with Debugging

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({ token });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
router.post("/signup", async (req, res) => {
    try {   
      const { name, email, password, role } = req.body;
  
      // Debugging Logs
      console.log("Received Signup Request:", req.body);
  
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      user = new User({ name, email, password: hashedPassword, role });
      await user.save();
  
      // Generate JWT Token (Ensure JWT_SECRET is set in .env)
      if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is not defined in .env file!");
        return res.status(500).json({ message: "Internal Server Error: Missing JWT_SECRET" });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({ message: "User registered successfully", token, role: user.role });
    } catch (error) {
      console.error("❌ Signup Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });

export default router;