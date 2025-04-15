import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosInstance from "./axiosInstance";
import Sidebar from "./Sidebar";

const CreateIssue = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Send the issue data to the backend
      const response = await axiosInstance.post("/tasks/issue", formData);

      // Redirect to the dashboard on success
      navigate("/customer-dashboard");
    } catch (err) {
      console.error("Error creating issue:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create issue. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-white text-center">
            Create New Ticket
          </h2>

          {error && (
            <div className="bg-red-700 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Brief description of your issue"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Please provide details about your issue"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 text-gray-900 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2 text-gray-900 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate("/customer-dashboard")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;
