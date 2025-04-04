import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Task = mongoose.model("Task", taskSchema);

export default Task; // Make sure this line is present