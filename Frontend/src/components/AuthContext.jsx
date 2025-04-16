import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UserType from "../constants/user.types";

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount and verify token
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log("Token expired");
            await handleLogout();
            return;
          }

          // Verify token with backend (optional extra security)
          try {
            const response = await axios.get(
              "http://localhost:4000/api/auth/me",
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Set user with backend data including name
            setCurrentUser({
              id: decoded.id,
              role: decoded.role,
              name: response.data.name || decoded.name || "",
            });
          } catch (error) {
            console.error("Error verifying token with backend:", error);
            // Still set user from token if backend verification fails
            setCurrentUser({
              id: decoded.id,
              role: decoded.role,
              name: decoded.name || "",
            });
          }
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Login function with role validation
  const login = async (email, password, selectedRole) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Verify that the user's role matches the selected portal
      const decoded = jwtDecode(data.token);

      if (decoded.role !== selectedRole) {
        console.error(
          "Role mismatch: User tried to log in to the wrong portal"
        );
        return false;
      }

      // Set token and user info
      localStorage.setItem("token", data.token);
      setCurrentUser({
        id: decoded.id,
        role: decoded.role,
        name: decoded.name || "",
      });

      // Navigate based on role
      if (decoded.role === UserType.EMPLOYEE) {
        navigate("/employee-dashboard");
      } else {
        navigate("/customer-dashboard");
      }

      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  // Signup function
  const signup = async (name, email, password, role) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/signup",
        {
          name,
          email,
          password,
          role,
        }
      );

      return { success: true, message: "Signup successful" };
    } catch (error) {
      console.error("Signup failed", error);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  // Expose auth context values
  const value = {
    currentUser,
    login,
    signup,
    logout: handleLogout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
