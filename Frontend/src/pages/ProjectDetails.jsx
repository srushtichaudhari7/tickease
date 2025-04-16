import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import StatusType from "../constants/status.type";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details and related tasks
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch project details
        const projectResponse = await axiosInstance.get(`/projects/${projectId}`);
        setProject(projectResponse.data);

        // Fetch tasks related to this project
        const tasksResponse = await axiosInstance.get("/tasks");
        const filteredTasks = tasksResponse.data.filter(
          (task) => task.project && task.project === projectId
        );
        setProjectTasks(filteredTasks);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details. Please try again later.");
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

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
          
          
            onClick={() => navigate("/employee-dashboard/projects")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 dark:text-white">Project Not Found</h2>
          <button
            onClick={() => navigate("/employee-dashboard/projects")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Projects
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
        <div className="mb-6">
          <button
            onClick={() => navigate("/employee-dashboard/projects")}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Back to Projects
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold mb-2 dark:text-white">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium dark:text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
              <p className="font-medium dark:text-white">{projectTasks.length}</p>
            </div>
          </div>
        </div>

        {/* Project Tasks */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">Project Tasks</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/employee-dashboard/my-tasks")}
            >
              + Add Task
            </button>
          </div>

          {projectTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No tasks have been added to this project yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projectTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description && task.description.substring(0, 50)}
                          {task.description && task.description.length > 50 && "..."}
                        </div>
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
                        {task.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "Not set"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => {
                            // Navigate to task details or edit page
                            console.log("View task details", task._id);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;