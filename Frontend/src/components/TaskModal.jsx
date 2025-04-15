import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { StatusType } from "../../../Shared/status.type.js";

const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    projectId: "",
    assigneeId: "",
    dueDate: "",
    status: StatusType.TO_DO,
  });
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch projects & members when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchMembers();
    }
  }, [isOpen]);

  // Fetch projects from backend
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/projects");
      setProjects(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch members from backend
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/members");
      setMembers(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Failed to load team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit task to backend
  const handleSubmit = async () => {
    const { title, projectId, assigneeId, dueDate } = taskData;

    if (!title || !projectId || !assigneeId || !dueDate) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/tasks", taskData);
      onTaskAdded(response.data);
      onClose();
      setError("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to create task. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setTaskData({
      title: "",
      projectId: "",
      assigneeId: "",
      dueDate: "",
      status: StatusType.TO_DO,
    });
    setError("");
    onClose();
  };

  // Status options from the shared StatusType
  const statusOptions = [
    { value: StatusType.TO_DO, label: "To-Do" },
    { value: StatusType.IN_PROGRESS, label: "In Progress" },
    { value: StatusType.COMPLETED, label: "Completed" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Create New Task
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Task Title */}
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded mb-3 text-gray-900 placeholder-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />

        {/* Project Selection */}
        <select
          className="w-full p-2 border rounded mb-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={taskData.projectId}
          onChange={(e) =>
            setTaskData({ ...taskData, projectId: e.target.value })
          }
        >
          <option value="" className="text-gray-500">
            Select Project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Assignee Selection */}
        <select
          className="w-full p-2 border rounded mb-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={taskData.assigneeId}
          onChange={(e) =>
            setTaskData({ ...taskData, assigneeId: e.target.value })
          }
        >
          <option value="" className="text-gray-500">
            Select Assignee
          </option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        {/* Due Date */}
        <input
          type="date"
          className="w-full p-2 border rounded mb-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={taskData.dueDate}
          onChange={(e) =>
            setTaskData({ ...taskData, dueDate: e.target.value })
          }
        />

        {/* Status */}
        <select
          className="w-full p-2 border rounded mb-4 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={taskData.status}
          onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-400"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-400"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
