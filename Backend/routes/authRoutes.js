import express from "express";
import {
  login,
  signup,
  getCurrentUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
