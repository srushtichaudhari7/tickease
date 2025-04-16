import { useState, useEffect } from "react";
import TaskTable from "../components/TaskTable";
import TaskKanban from "../components/TaskKanban";
import TaskCalendar from "../components/TaskCalendar";
import { useNavigate } from "react-router-dom";
import TaskModal from "../components/TaskModal";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../components/axiosInstance"; // ✅ Import your custom axiosInstance

const MyTasks = () => {
  const [view, setView] = useState("table");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // ✅ Fetch existing tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/api/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-gray-500">View all your tasks here</p>

        {/* View Switcher */}
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 ${
              view === "table" ? "bg-gray-600" : "bg-gray-100"
            }`}
            onClick={() => setView("table")}
          >
            Table
          </button>
          <button
            className={`px-4 py-2 ${
              view === "kanban" ? "bg-gray-600" : "bg-gray-600"
            }`}
            onClick={() => navigate("/employee-dashboard/my-tasks/kanban")}
          >
            Scrum 
          </button>
          <button
            className={`px-4 py-2 ${
              view === "calendar" ? "bg-gray-600" : "bg-gray-600"
            }`}
            onClick={() => navigate("/employee-dashboard/my-tasks/calendar")}
          >
            Calendar
          </button>
        </div>

        {/* New Task Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg my-4"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ New Task
        </button>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={(newTask) => setTasks((prev) => [...prev, newTask])}
        />

        {/* Render View */}
        {view === "table" && <TaskTable tasks={tasks} />}
        {view === "kanban" && <TaskKanban />}
        {view === "calendar" && <TaskCalendar />}
      </div>
    </div>
  );
};

export default MyTasks;
