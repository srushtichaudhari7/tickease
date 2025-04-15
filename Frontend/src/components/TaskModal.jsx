import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
    const [taskData, setTaskData] = useState({
        title: "",
        projectname : "",
        projectId: "",
        assigneename : "",
        assigneeId: "",
        dueDate: "",
        status: "Backlog",
    });

    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);

    // 🟡 Fetch projects & members when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchProjects();
            fetchMembers();
        }
    }, [isOpen]);

    // ✅ Fetch projects from backend
    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:4000/api/projects");
            console.log("Fetched Projects:", response.data); // for debugging
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // ✅ Fetch members from backend
    const fetchMembers = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:4000/api/members");
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    // ✅ Submit task to backend
    const handleSubmit = async () => {
        const { title, projectId, assigneeId, dueDate } = taskData;

        if (!title || !projectId || !assigneeId || !dueDate) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axiosInstance.post("http://localhost:4000/api/tasks", taskData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            onTaskAdded(response.data);
            onClose();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // ✅ UI Rendering
    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Task</h2>

                {/* Task Title */}
<input
    type="text"
    placeholder="Task Title"
    className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-900"
    value={taskData.title}
    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
/>

{/* Project Selection */}
<select
    className="w-full p-2 border rounded mb-3 text-gray-900"
    value={taskData.projectId}
    onChange={(e) => setTaskData({ ...taskData, projectId: e.target.value })}
>
    <option value="" className="text-gray-500">Select Project</option>
    {projects.map((project) => (
        <option key={project._id} value={project._id}>
            {project.name}
        </option>
    ))}
</select>

{/* Assignee Selection */}
<select
    className="w-full p-2 border rounded mb-3 text-gray-900"
    value={taskData.assigneeId}
    onChange={(e) => setTaskData({ ...taskData, assigneeId: e.target.value })}
>
    <option value="" className="text-gray-500">Select Assignee</option>
    {members.map((member) => (
        <option key={member._id} value={member._id}>
            {member.name}
        </option>
    ))}
</select>

{/* Due Date */}
<input
    type="date"
    className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-900"
    value={taskData.dueDate}
    onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
/>

{/* Status */}
<select
    className="w-full p-2 border rounded mb-4 text-gray-900"
    value={taskData.status}
    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
>
    <option value="Backlog">Backlog</option>
    <option value="In Progress">In Progress</option>
    <option value="In Review">In Review</option>
    <option value="To-Do">To-Do</option>
    <option value="Done">Done</option>
</select>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default TaskModal;
