import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import StatusType from "../constants/status.type";
import { DatePicker } from 'react-datepicker';

const ConvertTicket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch ticket details
        const ticketRes = await axiosInstance.get(`/tasks/ticket/${ticketId}`);
        setTicket(ticketRes.data);
        // Fetch employees
        const membersRes = await axiosInstance.get("/members");
        setEmployees(membersRes.data || membersRes);
        // Fetch projects
        const projectsRes = await axiosInstance.get("/projects");
        setProjects(projectsRes.data || projectsRes);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load ticket details. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [ticketId]);

  const handleConvert = async () => {
    if (!assigneeId || !projectId) {
      setError("Please select both an assignee and a project.");
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.put(`/tasks/convert-ticket/${ticketId}`, {
        assignedTo: assigneeId,
        project: projectId,
        dueDate: dueDate
      });
      alert("Ticket successfully converted to task!");
      navigate("/employee-dashboard/my-tasks");
    } catch (err) {
      setError("Failed to convert ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold dark:text-white mb-2">Convert Ticket to Task</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Ticket Details</h2>
          <div className="mb-4">
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Title:</span> {ticket?.title}
            </div>
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Description:</span> {ticket?.description || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Customer:</span> {ticket?.userId?.name || "Unknown"}
            </div>
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Priority:</span> {ticket?.priority}
            </div>
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Created:</span> {new Date(ticket?.createdAt).toLocaleString()}
            </div>
            <div className="mb-2">
              <span className="font-semibold dark:text-gray-200">Status:</span> {ticket?.status}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 dark:text-gray-200">Assign to Employee</label>
            <select className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1 dark:text-gray-200">Assign to Project</label>
            <select className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Select Project</option>
              {projects.map(proj => (
                <option key={proj._id} value={proj._id}>{proj.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              minDate={new Date()}
              placeholderText="Select due date"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-4">
            <button disabled={submitting} onClick={handleConvert} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50">
              {submitting ? "Converting..." : "Convert to Task"}
            </button>
            <button onClick={() => navigate(-1)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertTicket;