import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import StatusType from "../constants/status.type";

const TaskTable = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc",
  });
  const [filter, setFilter] = useState({ status: "", priority: "" });

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

  // Sorting function
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtering function
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Apply sorting and filtering
  const filteredTasks = tasks.filter((task) => {
    return (
      (filter.status === "" || task.status === filter.status) &&
      (filter.priority === "" || task.priority === filter.priority)
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case StatusType.TO_DO:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case StatusType.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case StatusType.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });

      // Update task in state
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
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

  return (
    <div className="overflow-x-auto">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Tasks
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
          >
            <option value="">All Statuses</option>
            <option value={StatusType.TO_DO}>To Do</option>
            <option value={StatusType.IN_PROGRESS}>In Progress</option>
            <option value={StatusType.COMPLETED}>Completed</option>
          </select>

          <select
            name="priority"
            value={filter.priority}
            onChange={handleFilterChange}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr >
                        <th className="p-2 border">Task Name</th>
                        <th className="p-2 border">Project</th>
                        <th className="p-2 border">Assignee</th>
                        <th className="p-2 border">Due Date</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id || index} className="text-center">
                            <td className="p-2 border">{task.title}</td>
                            <td className="p-2 border">{task.projectId?.name || "N/A"}</td>
                            <td className="p-2 border">{task.assignee?.name || "N/A"}</td>
                            <td className="p-2 border">{task.dueDate?.split("T")[0]}</td>
                            <td className="p-2 border bg-green-200">{task.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
