import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { UserType } from "../../../Shared/user.types.js";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (role && currentUser.role !== role) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === UserType.EMPLOYEE) {
      return <Navigate to="/employee-dashboard" />;
    } else {
      return <Navigate to="/customer-dashboard" />;
    }
  }

  // User is authenticated and has the right role, render children
  return children;
};

export default ProtectedRoute;
