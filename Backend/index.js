import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import router from "./routes/taskRoutes.js";
import projectroute from "./routes/projectRoutes.js";

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
let Mongo = process.env.MONGO_URI;
console.log("Mongo URI:", Mongo); // Debugging log
mongoose.connect(Mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => [Mongo , console.log("DB Connection Error:", err)]);
    
// Sample Route
app.use("/api/auth", authRoutes); // Make sure auth routes are used
app.use("/api/tasks", router);
app.get("/", (req, res) => {
  res.send("Tickease Backend Running!");
});
app.use("/api/projects", projectroute); // Add project routes


// Import Routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));