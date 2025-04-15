import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { UserType } from "../../../Shared/user.types.js";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(UserType.CUSTOMER); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signup(name, email, password, role);

      if (result.success) {
        setLoading(false);
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        setLoading(false);
        setError(result.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Signup failed! Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Signup to TickEase Portal
        </h2>

        {/* Portal Selection Toggle */}
        <div className="flex mb-6 bg-gray-700 rounded-md p-1">
          <button
            type="button"
            onClick={() => setRole(UserType.CUSTOMER)}
            className={`flex-1 py-2 rounded-md transition duration-300 text-center ${
              role === UserType.CUSTOMER
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-600"
            }`}
          >
            Customer Portal
          </button>
          <button
            type="button"
            onClick={() => setRole(UserType.EMPLOYEE)}
            className={`flex-1 py-2 rounded-md transition duration-300 text-center ${
              role === UserType.EMPLOYEE
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

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
            />
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-md transition duration-300 font-medium 
              ${
                loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            disabled={loading}
          >
            {loading
              ? "Signing Up..."
              : `Create ${
                  role === UserType.CUSTOMER ? "Customer" : "Employee"
                } Account`}
          </button>

          <p className="mt-4 text-center text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
