import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { UserType } from "../../../Shared/user.types.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPortal, setSelectedPortal] = useState(UserType.CUSTOMER); // Default to Customer
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === UserType.EMPLOYEE) {
        navigate("/employee-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the login function from AuthContext with the selected role
      const success = await login(email, password, selectedPortal);

      if (!success) {
        setError(
          "Invalid credentials or incorrect portal selected. Please try again."
        );
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login to TickEase Portal
        </h2>

        {/* Portal Selection Toggle */}
        <div className="flex mb-6 bg-gray-700 rounded-md p-1">
          <button
            type="button"
            onClick={() => setSelectedPortal(UserType.CUSTOMER)}
            className={`flex-1 py-2 rounded-md transition duration-300 text-center ${
              selectedPortal === UserType.CUSTOMER
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-600"
            }`}
          >
            Customer Portal
          </button>
          <button
            type="button"
            onClick={() => setSelectedPortal(UserType.EMPLOYEE)}
            className={`flex-1 py-2 rounded-md transition duration-300 text-center ${
              selectedPortal === UserType.EMPLOYEE
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-600"
            }`}
          >
            Employee Portal
          </button>
        </div>

        {error && (
          <div className="bg-red-700 text-white px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-3 rounded-md transition duration-300 font-medium 
            ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          disabled={isLoading}
        >
          {isLoading
            ? "Logging in..."
            : `Login to ${
                selectedPortal === UserType.CUSTOMER ? "Customer" : "Employee"
              } Portal`}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
