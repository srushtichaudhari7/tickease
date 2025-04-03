import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { FaTasks, FaCog, FaUsers, FaFolderOpen, FaHome, FaHeadset } from "react-icons/fa";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();  // 👈 Use navigate() instead of state switching

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        projectId: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/dashboard", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setTasks(response.data.tasks);
                setProjects(response.data.projects);
                setMembers(response.data.members);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    const handleTaskSubmit = async () => {
        if (!newTask.title || !newTask.projectId) {
            alert("Task Title and Project are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/tasks", newTask, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            setTasks([...tasks, response.data]);
            setIsModalOpen(false);
            setNewTask({ title: "", description: "", dueDate: "", projectId: "" });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5 flex flex-col justify-between">
                <div>
                    {/* Logo */}
                    <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-6">Jira Clone</h2>

                    {/* Sidebar Links */}
                    <nav className="space-y-4">
                        <SidebarItem icon={<FaHome />} text="Home" onClick={() => navigate("/")} />
                        <SidebarItem icon={<FaTasks />} text="My Tasks" onClick={() => navigate("/employee-dashboard/my-tasks")} />
                        <SidebarItem icon={<FaUsers />} text="Members" onClick={() => navigate("/employee-dashboard/members")} />
                        <SidebarItem icon={<FaFolderOpen />} text="Projects" onClick={() => navigate("/employee-dashboard/projects")} />
                        <SidebarItem icon={<FaCog />} text="Settings" onClick={() => navigate("/employee-dashboard/settings")} />
                        <SidebarItem icon={<FaHeadset />} text="Support" onClick={() => navigate("/employee-dashboard/support")} />
                    </nav>

                </div>

                {/* User Info */}
                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center">
                    <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        S
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-gray-700 dark:text-white">Srushti Chaudhari</p>
                        <p className="text-xs text-gray-500">srushtichaudhari36@gmail.com</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                
                    <>
                        <h1 className="text-2xl font-bold">Home</h1>
                        <p className="text-gray-500 text-sm">Monitor all your projects and tasks here</p>

                        {/* Dashboard Metrics */}
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            <MetricBox title="Total Tasks" value={tasks.length} />
                            <MetricBox title="Assigned Tasks" value={tasks.length} />
                            <MetricBox title="Completed Tasks" value={tasks.filter(task => task.status === "Completed").length} />
                            <MetricBox title="Incomplete Tasks" value={tasks.filter(task => task.status !== "Completed").length} />
                            <MetricBox title="Overdue Tasks" value={tasks.filter(task => new Date(task.dueDate) < new Date()).length} />
                        </div>

                        {/* Tasks Section */}
                        <Section title="📌 Tasks" count={tasks.length} onAdd={() =>     (true)}>
                            {tasks.map(task => (
                                <li key={task._id} className="p-2 border-b dark:border-gray-700">
                                    📝 {task.title} - <span className="text-gray-500 dark:text-gray-300">{task.status}</span>
                                </li>
                            ))}
                        </Section>

                        {/* Members Section */}
                        <Section title="👥 Members" count={members.length}>
                            {members.map(member => (
                                <li key={member._id} className="p-2 border-b dark:border-gray-700">
                                    {member.name} - <span className="text-gray-500">{member.email}</span>
                                </li>
                            ))}
                        </Section>

                        {/* Projects Section */}
                        <Section title="📂 Projects" count={projects.length}>
                            {projects.map(project => (
                                <li key={project._id} className="p-2 border-b dark:border-gray-700">
                                    📌 {project.name}
                                </li>
                            ))}
                        </Section>
                    </>
                
            </div>
        </div>
    );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, onClick }) => (
    <div
        className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={onClick}
    >
        {icon}
        <span>{text}</span>
    </div>
);

// Reusable Metric Box
const MetricBox = ({ title, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-2xl">{value}</p>
    </div>
);

// Reusable Section Component
const Section = ({ title, count, onAdd, children }) => (
    <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow relative">
        <h2 className="text-xl font-bold">{title} ({count})</h2>
        {onAdd && (
            <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onAdd}>
                ➕
            </button>
        )}
        <ul className="mt-2">{children}</ul>
    </div>
);

export default Home;
