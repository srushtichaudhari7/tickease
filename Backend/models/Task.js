import mongoose from "mongoose";
import  StatusType  from "../../Shared/status.type.js";

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User reference
    title: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ["Backlog", "In Progress", "In Review", "To-Do", "Done"], 
        default: "Backlog" 
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
