import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: "", description: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch projects from backend
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get("/projects");

                setProjects(response.data);
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

    return (
        <div className="flex h-screen">
            {/* Sidebar on the left */}
            <div className="w-64 bg-gray-100">
                <Sidebar />
            </div>

            {/* Main content on the right */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Projects</h1>

                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
                    onClick={() => setIsModalOpen(true)}
                >
                    ➕ Add Project
                </button>

                {/* Project List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project._id} className="p-4 bg-white shadow rounded-lg">
                            <h2 className="text-lg font-bold">{project.name}</h2>
                            <p className="text-sm text-gray-600">{project.description}</p>
                            <button
                                className="mt-2 text-blue-500"
                                onClick={() => navigate(`/projects/${project._id}`)}
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Project Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-grey bg-opacity-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-grey p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">New Project</h2>
                            <input
                                type="text"
                                placeholder="Project Name"
                                className="w-full border p-2 mb-2"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Project Description"
                                className="w-full border p-2 mb-2"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            ></textarea>
                            <div className="flex justify-end">
                                <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleProjectSubmit}>Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;