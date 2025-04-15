import { useNavigate } from "react-router-dom";
import {
  FaTasks,
  FaCog,
  FaUsers,
  FaFolderOpen,
  FaHome,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { GiToken } from "react-icons/gi";
import { useAuth } from "./AuthContext";
import { UserType } from "../../../Shared/user.types.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-5 flex flex-col justify-between">
      <div>
        {/* Logo */}
        <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-6">
          TickEase
        </h2>

        {/* Sidebar Links */}
        <nav className="space-y-4">
          {currentUser?.role === UserType.EMPLOYEE ? (
            <>
              <SidebarItem
                icon={<FaHome />}
                text="Home"
                onClick={() => navigate("/employee-dashboard")}
              />
              <SidebarItem
                icon={<FaFolderOpen />}
                text="Projects"
                onClick={() => navigate(`/employee-dashboard/projects`)}
              />

              <SidebarItem
                icon={<FaUsers />}
                text="Members"
                onClick={() => navigate(`/employee-dashboard/members`)}
              />

              <SidebarItem
                icon={<FaTasks />}
                text="My Tasks"
                onClick={() => navigate(`/employee-dashboard/my-tasks`)}
              />
            </>
          ) : (
            <>
              <SidebarItem
                icon={<FaHome />}
                text="Home"
                onClick={() => navigate("/customer-dashboard")}
              />
              <SidebarItem
                icon={<GiToken />}
                text="Create Issue"
                onClick={() => navigate(`/customer-dashboard/create-issue`)}
              />
            </>
          )}

          {/* <SidebarItem
            icon={<FaCog />}
            text="Settings"
            onClick={() => navigate(`${dashboardRoot}/settings`)}
          />
          <SidebarItem
            icon={<FaHeadset />}
            text="Support"
            onClick={() => navigate(`${dashboardRoot}/support`)}
          /> */}

          {/* Logout button */}
          <SidebarItem
            icon={<FaSignOutAlt />}
            text="Logout"
            onClick={logout}
            className="text-red-500 dark:text-red-400"
          />
        </nav>
      </div>

      {/* User Info */}
      <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center">
        <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
          {currentUser?.name?.charAt(0) || "U"}
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-gray-700 dark:text-white">
            {currentUser?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {currentUser?.role === UserType.EMPLOYEE ? "Employee" : "Customer"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, onClick, className = "" }) => (
  <div
    className={` flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 ${className}`}
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;
