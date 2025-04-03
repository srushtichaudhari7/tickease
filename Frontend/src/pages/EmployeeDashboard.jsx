import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [stats, setStats] = useState({});

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
    }, []);

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 h-screen">
                <h2 className="text-xl font-bold mb-4">Dashboard</h2>
                <ul>
                    <li className="mb-2">🏠 Home</li>
                    <li className="mb-2">📋 My Tasks</li>
                    <li className="mb-2">⚙️ Settings</li>
                    <li className="mb-2">👥 Members</li>
                </ul>
            </div>

            {/* Main Dashboard */}
            <div className="w-3/4 p-6">
                <h1 className="text-2xl font-bold">Employee Dashboard</h1>

                {/* Stats Section */}
                <div className="grid grid-cols-5 gap-4 mt-4">
                    <div className="p-4 bg-green-100 rounded shadow">Total Tasks: {stats.totalTasks}</div>
                    <div className="p-4 bg-blue-100 rounded shadow">Assigned Tasks: {stats.assignedTasks}</div>
                    <div className="p-4 bg-yellow-100 rounded shadow">Completed Tasks: {stats.completedTasks}</div>
                    <div className="p-4 bg-red-100 rounded shadow">Incomplete Tasks: {stats.incompleteTasks}</div>
                    <div className="p-4 bg-gray-100 rounded shadow">Overdue Tasks: {stats.overdueTasks}</div>
                </div>

                {/* Tasks Section */}
                <h2 className="text-xl font-bold mt-6">Tasks</h2>
                <ul className="mt-2">
                    {tasks.map(task => (
                        <li key={task._id} className="p-2 border-b">
                            📝 {task.title} - <span className="text-gray-500">{task.status}</span>
                        </li>
                    ))}
                </ul>

                {/* Projects Section */}
                <h2 className="text-xl font-bold mt-6">Projects</h2>
                <ul className="mt-2">
                    {projects.map(project => (
                        <li key={project._id} className="p-2 border-b">
                            📁 {project.name}
                        </li>
                    ))}
                </ul>

                {/* Members Section */}
                <h2 className="text-xl font-bold mt-6">Team Members</h2>
                <ul className="mt-2">
                    {members.map(member => (
                        <li key={member._id} className="p-2 border-b">
                            👤 {member.name} ({member.email})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EmployeeDashboard;