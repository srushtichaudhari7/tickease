import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import router from "./routes/taskRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
    origin: "*",  // Temporarily allow all origins (you can restrict later)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true 
  }));
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => [console.log(process.env.MONGO_URI) , console.log("DB Connection Error:", err)]);
    
// Sample Route
app.use("/api/auth", authRoutes); // Make sure auth routes are used
app.use("/api/tasks", router);
app.get("/", (req, res) => {
  res.send("Tickease Backend Running!");
});

// Import Routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));