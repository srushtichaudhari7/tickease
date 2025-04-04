import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* ✅ Use Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
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
                <Section title="📌 Tasks" count={tasks.length}>
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
            </div>
        </div>
    );
};

// Reusable Metric Box
const MetricBox = ({ title, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-2xl">{value}</p>
    </div>
);

// Reusable Section Component
const Section = ({ title, count, children }) => (
    <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow relative">
        <h2 className="text-xl font-bold">{title} ({count})</h2>
        <ul className="mt-2">{children}</ul>
    </div>
);

export default Home;