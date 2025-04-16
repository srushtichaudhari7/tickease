import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import StatusType from "../constants/status.type";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic data states
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingProjects: 0,
    teammatePerformance: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksResponse, statsResponse, projectsResponse] =
          await Promise.all([
            axiosInstance.get("/tasks"),
            axiosInstance.get("/dashboard/employee-stats"),
            axiosInstance.get("/projects"),
          ]);

        // Set tasks data
        setTasks(tasksResponse.data || []);

        // Set projects data
        setProjects(projectsResponse.data || []);

        // Set employee stats
        const taskData = tasksResponse.data || [];
        const completedTasks = taskData.filter(
          (task) => task.status === StatusType.COMPLETED
        ).length;
        setStats({
          totalTasks: taskData.length,
          completedTasks: completedTasks,
          pendingProjects: projectsResponse.data?.length || 0,
          teammatePerformance: [], // Remove teammate performance since it's not implemented in backend
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case StatusType.TO_DO:
        return "bg-red-100 text-red-800";
      case StatusType.IN_PROGRESS:
        return "bg-orange-100 text-orange-800";
      case StatusType.COMPLETED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Welcome, {currentUser?.name || "Employee"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Here's what's happening in your projects today
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              Total Tasks
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {stats.totalTasks}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              Completed
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {stats.completedTasks}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              Projects
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {stats.pendingProjects}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            {/* <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tasks"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button> */}
            {/* <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button> */}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Recent Tasks
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Assigned To
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.slice(0, 5).map((task) => (
                      <tr key={task._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {task.assignedTo?.name || "Unassigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}

                    {tasks.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          No tasks found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-center">
                <button
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  onClick={() => navigate("/tasks")}
                >
                  View All Tasks
                </button>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Active Projects
                </h2>
              </div>

              <div className="px-6 pb-4 space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project._id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0"
                  >
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {project.description}
                    </p>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    No projects found
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-center">
                <button
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
                  onClick={() => navigate("/employee-dashboard/projects")}
                >
                  View All Projects
                </button>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Team Performance
                </h2>
                <div className="space-y-3">
                  {stats.teammatePerformance &&
                    stats.teammatePerformance.map((member, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1/4 text-sm text-gray-500 dark:text-gray-400">
                          {member.name}
                        </div>
                        <div className="w-3/4 flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (member.tasksCompleted /
                                    (member.tasksCompleted +
                                      member.tasksInProgress)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {member.tasksCompleted}/
                            {member.tasksCompleted + member.tasksInProgress}
                          </span>
                        </div>
                      </div>
                    ))}

                  {(!stats.teammatePerformance ||
                    stats.teammatePerformance.length === 0) && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                      No team data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
