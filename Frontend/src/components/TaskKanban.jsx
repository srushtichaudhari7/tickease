import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import StatusType from "../constants/status.type";

const TaskKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/tasks");
        setTasks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === StatusType.TO_DO);
  const inProgressTasks = tasks.filter(
    (task) => task.status === StatusType.IN_PROGRESS
  );
  const completedTasks = tasks.filter(
    (task) => task.status === StatusType.COMPLETED
  );

  // Update task status
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    try {
      const updatedTask = await axiosInstance.put(`/tasks/${taskId}/status`, {
        status,
      });

      // Update task in state
      setTasks(
        tasks.map((task) => (task._id === taskId ? { ...task, status } : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  // Render task card
  const renderTask = (task) => (
    <div
      key={task._id}
      className="bg-white dark:bg-gray-700 shadow-sm rounded p-3 mb-2 cursor-move"
      draggable
      onDragStart={(e) => handleDragStart(e, task._id)}
    >
      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
        {task.title}
      </h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            task.priority === "High"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Task Board
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, StatusType.TO_DO)}
        >
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            To Do ({todoTasks.length})
          </h3>
          {todoTasks.map(renderTask)}
          {todoTasks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No tasks
            </p>
          )}
        </div>

        {/* In Progress Column */}
        <div
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, StatusType.IN_PROGRESS)}
        >
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            In Progress ({inProgressTasks.length})
          </h3>
          {inProgressTasks.map(renderTask)}
          {inProgressTasks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No tasks
            </p>
          )}
        </div>

        {/* Completed Column */}
        <div
          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, StatusType.COMPLETED)}
        >
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Completed ({completedTasks.length})
          </h3>
          {completedTasks.map(renderTask)}
          {completedTasks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskKanban;
