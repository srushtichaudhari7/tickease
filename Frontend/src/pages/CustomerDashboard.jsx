import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../components/axiosInstance";
import StatusType from "../constants/status.type";
import { toast } from "react-toastify"; // Import toast for notifications

function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic data states
  const [tickets, setTickets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    openIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to update ticket status
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      setIsLoading(true); // Indicate loading during update
      await axiosInstance.put(`/tasks/tickets/${ticketId}/status`, {
        status: newStatus,
      });
      // Refresh tickets list after update
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      );
      setTickets(updatedTickets);

      // Recalculate stats after status change
      setStats({
        openIssues: updatedTickets.filter(
          (t) => t.status === StatusType.TO_DO || StatusType.CONVERTED_TO_TASK
        ).length,
        inProgressIssues: updatedTickets.filter(
          (t) =>
            t.status === StatusType.IN_PROGRESS ||
            t.status === StatusType.CONVERTED_TO_TASK
        ).length,
        resolvedIssues: updatedTickets.filter(
          (t) =>
            t.status === StatusType.COMPLETED || t.status === StatusType.CLOSED
        ).length,
      });
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating ticket status:", err);
      toast.error("Failed to update ticket status.");
      setError(err.response?.data?.message || "Error updating ticket status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = (ticketId) => {
    updateTicketStatus(ticketId, StatusType.CLOSED);
  };

  const handleReopenTicket = (ticketId) => {
    updateTicketStatus(ticketId, StatusType.TO_DO);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch customer's own tickets
        const response = await axiosInstance.get("/tasks/my-tickets");
        console.log(response.data);

        // Process and set ticket data
        const ticketData = response.data || [];
        setTickets(
          ticketData.map((ticket) => ({
            id: ticket._id, // Use the actual ticket ID
            title: ticket.title,
            status: ticket.status,
            // Priority is not directly shown here anymore, but status implies it
            created: getTimeAgo(ticket.createdAt),
          }))
        );

        // Calculate statistics based on ticket statuses
        setStats({
          // Open includes To Do
          openIssues: ticketData.filter(
            (ticket) =>
              ticket.status === StatusType.TO_DO || StatusType.CONVERTED_TO_TASK
          ).length,
          // In Progress includes Converted to Task
          inProgressIssues: ticketData.filter(
            (ticket) =>
              ticket.status === StatusType.IN_PROGRESS ||
              ticket.status === StatusType.CONVERTED_TO_TASK
          ).length,
          // Resolved includes Completed and Closed
          resolvedIssues: ticketData.filter(
            (ticket) =>
              ticket.status === StatusType.COMPLETED ||
              ticket.status === StatusType.CLOSED
          ).length,
        });

        // Set sample announcements (would come from API in production)
        // setAnnouncements([
        //   {
        //     id: 1,
        //     title: "Scheduled maintenance on April 20th",
        //     date: "Apr 13, 2025",
        //   },
        //   {
        //     id: 2,
        //     title: "New features released!",
        //     date: "Apr 10, 2025",
        //   },
        // ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions for data processing
  const getPriorityFromStatus = (status) => {
    switch (status) {
      case StatusType.TO_DO:
        return "High";
      case StatusType.IN_PROGRESS:
        return "Medium";
      case StatusType.COMPLETED:
        return "Low";
      default:
        return "Medium";
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
          <h2 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Welcome, {currentUser?.name || "Customer"}
            </h1>
            {/* <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage your support tickets and requests
            </p> */}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              Open Issues
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {/* {stats.openIssues} */}9
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              In Progress
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {/* {stats.inProgressIssues} */} 4
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              Resolved
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {/* {stats.resolvedIssues} */}2
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex -mb-px">
            {/* Keep only the My Tickets button */}
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600 dark:text-blue-400`}
            >
              My Tickets
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Recent Tickets
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-white dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Ticket ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      {/* Priority column removed */}
                      {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th> */}
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      680016gf28f5a83c08a5564
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        Period 
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center">
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Completed
                          </span>
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() =>
                            console.log("Closing sample ticket...")
                          }
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Close Ticket
                        </button>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Today
                      </td>
                    </tr>

                    {tickets.length > 0 ? (
                      tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {ticket.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="flex items-center">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  ticket.status === StatusType.TO_DO
                                    ? "bg-red-400" // To Do
                                    : ticket.status ===
                                        StatusType.IN_PROGRESS ||
                                      ticket.status ===
                                        StatusType.CONVERTED_TO_TASK
                                    ? "bg-orange-400" // In Progress
                                    : ticket.status === StatusType.COMPLETED ||
                                      ticket.status === StatusType.CLOSED
                                    ? "bg-green-400" // Completed
                                    : "bg-yellow-400" // Default/Other
                                } mr-2`}
                              ></span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {ticket.status}
                              </span>
                            </span>
                          </td>

                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {/* Conditional Actions */}
                            {/* {ticket.status === StatusType.COMPLETED && (
                              <button
                                onClick={() => handleCloseTicket(ticket.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
                                disabled={isLoading} // Disable button while loading
                              >
                                Close Ticket
                              </button>
                            )}
                            {ticket.status === StatusType.CLOSED && (
                              <button
                                onClick={() => handleReopenTicket(ticket.id)}
                                className="text-green-600 hover:text-green-800 text-xs font-medium disabled:opacity-50"
                                disabled={isLoading} // Disable button while loading
                              >
                                Re-open Ticket
                              </button>
                            )}
                            {/* Add other actions if needed, e.g., View Details */}
                       
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {ticket.created}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          No tickets found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Support Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Contact Support
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Live Chat
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Knowledge Base
                </button>
              </div>
            </div>

            {/* Announcements Section
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Announcements
              </h2>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={
                      announcement.id < announcements.length
                        ? "border-b border-gray-200 dark:border-gray-700 pb-4"
                        : ""
                    }
                  >
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {announcement.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {announcement.date}
                    </p>
                  </div>
                ))}
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
