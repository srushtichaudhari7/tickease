import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  
  const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT manually

  return user.role === role ? children : <Navigate to="/" />;
};

export default ProtectedRoute;