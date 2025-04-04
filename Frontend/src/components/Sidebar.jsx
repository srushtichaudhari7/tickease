import { useNavigate } from "react-router-dom";
import { FaTasks, FaCog, FaUsers, FaFolderOpen, FaHome, FaHeadset } from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5 flex flex-col justify-between">
            <div>
                {/* Logo */}
                <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-6">Jira Clone</h2>

                {/* Sidebar Links */}
                <nav className="space-y-4">
                    <SidebarItem icon={<FaHome />} text="Home" onClick={() => navigate("/employee-dashboard")} />
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
                    
                </div>
                <div className="ml-3">
                    <p className="text-sm font-bold text-gray-700 dark:text-white">Srushti Chaudhari</p>
                    <p className="text-xs text-gray-500">srushtichaudhari36@gmail.com</p>
                </div>
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

export default Sidebar;