import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import { FiPlus, FiFilter } from "react-icons/fi";
import StatusType from "../constants/status.type";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get all projects
        const projectsResponse = await axiosInstance.get("/projects");
        const projectsData = projectsResponse.data;
        
        // Get all tasks to calculate progress and task counts
        const tasksResponse = await axiosInstance.get("/tasks");
        const tasksData = tasksResponse.data;
        
        // Process projects with actual data
        const projectsWithData = projectsData.map(project => {
          // Filter tasks for this project
          const projectTasks = tasksData.filter(task => task.project === project._id);
          const totalTasks = projectTasks.length;
          const completedTasks = projectTasks.filter(task => task.status === StatusType.COMPLETED).length;
          
          // Calculate progress percentage
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          
          return {
            ...project,
            progress: progress,
            tasksCount: totalTasks,
            createdAt: project.createdAt || new Date().toISOString()
          };
        });
        
        setProjects(projectsWithData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);


  // Add new project
  const handleProjectSubmit = async () => {
    if (!newProject.name) {
      alert("Project Name is required!");
      return;
    }

    try {
      const response = await axiosInstance.post("/projects", newProject);

      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // Filter and sort projects
  const getFilteredProjects = () => {
    let filtered = [...projects];
    
    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  };



  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus className="mr-2" /> Add Project
          </button>
        </div>

        {/* Sorting */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-end">
          <div className="flex items-center">
            <span className="text-gray-300 mr-2">Sort by:</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredProjects().map((project) => (
            <div key={project._id} className="bg-gray-800 shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-300">
              <div className="p-5 border-b border-gray-100">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-white mb-1">{project.name}</h2>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">{project.description || "No description provided"}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{project.tasksCount} Tasks</span>
                  <span>{project.progress}% Complete</span>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3">
                <button
                  className="w-full text-blue-400 hover:text-blue-600 font-medium flex justify-center items-center transition-colors duration-300"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {getFilteredProjects().length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No projects found matching your filters.</p>
          </div>
        )}

        {/* Add Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Create New Project</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="projectName">
                  Project Name *
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="Enter project name"
                  className="w-full border border-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="projectDescription">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  placeholder="Enter project description"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleProjectSubmit}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
