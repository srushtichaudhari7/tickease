import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [stats, setStats] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/dashboard", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setTasks(response.data.tasks);
                setProjects(response.data.projects);
                setMembers(response.data.members);
                setStats(response.data.stats);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();

        // Check localStorage for dark mode state
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode === "enabled") {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
            setIsDarkMode(true);
        }
    };

    return (
        <div className={`flex ${isDarkMode ? "dark" : ""}`}>
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 h-screen dark:bg-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">📊 Dashboard</h2>
                <ul className="menu p-2 rounded-box space-y-2">
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>🏠 Home</span>
                    </li>
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>📋 My Tasks</span>
                    </li>
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>⚙️ Settings</span>
                    </li>
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>👥 Members</span>
                    </li>

                    {/* Support Section */}
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>🛠️ Support</span>
                    </li>

                    {/* Dotted Line Separator */}
                    <li className="border-t-2 border-dashed border-gray-500 dark:border-gray-300 my-2"></li>

                    {/* Projects Section */}
                    <li className="hover:bg-primary hover:text-white rounded p-2">
                        <span>📂 Projects</span>
                    </li>
                </ul>

                {/* Dark Mode Toggle */}
                <button
                    className="btn btn-primary mt-6"
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            {/* Main Dashboard */}
            <div className="w-3/4 p-6 bg-white dark:bg-gray-800 dark:text-white">
                <h1 className="text-2xl font-bold">Employee Dashboard</h1>

                {/* Stats Section */}
                <div className="grid grid-cols-5 gap-4 mt-4">
                    <div className="p-4 bg-green-100 dark:bg-green-900 rounded shadow">Total Tasks: {stats.totalTasks}</div>
                    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded shadow">Assigned Tasks: {stats.assignedTasks}</div>
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded shadow">Completed Tasks: {stats.completedTasks}</div>
                    <div className="p-4 bg-red-100 dark:bg-red-900 rounded shadow">Incomplete Tasks: {stats.incompleteTasks}</div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">Overdue Tasks: {stats.overdueTasks}</div>
                </div>

                {/* Tasks Section */}
                <h2 className="text-xl font-bold mt-6">📌 Tasks</h2>
                <ul className="mt-2">
                    {tasks.map(task => (
                        <li key={task._id} className="p-2 border-b dark:border-gray-700">
                            📝 {task.title} - <span className="text-gray-500 dark:text-gray-300">{task.status}</span>
                        </li>
                    ))}
                </ul>

                {/* Projects Section */}
                <h2 className="text-xl font-bold mt-6">📁 Projects</h2>
                <ul className="mt-2">
                    {projects.map(project => (
                        <li key={project._id} className="p-2 border-b dark:border-gray-700">
                            📁 {project.name}
                        </li>
                    ))}
                </ul>

                {/* Members Section */}
                <h2 className="text-xl font-bold mt-6">👥 Team Members</h2>
                <ul className="mt-2">
                    {members.map(member => (
                        <li key={member._id} className="p-2 border-b dark:border-gray-700">
                            👤 {member.name} ({member.email})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
