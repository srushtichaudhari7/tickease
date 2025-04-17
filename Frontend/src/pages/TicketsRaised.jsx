import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";
import StatusType from "../constants/status.type";

const TicketsRaised = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [convertingTicketId, setConvertingTicketId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch customer tickets
        const ticketsResponse = await axiosInstance.get("/tasks/customer-tickets");
        setTickets(ticketsResponse.data);

        // Fetch employees for assignment dropdown
        const membersResponse = await axiosInstance.get("/members");
        setEmployees(membersResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError("Failed to load tickets. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConvertTicket = async (ticketId) => {
    if (!selectedEmployee) {
      alert("Please select an employee to assign this ticket to.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/tasks/convert-ticket/${ticketId}`, {
        assignedTo: selectedEmployee
      });

      // Update the tickets list by removing the converted ticket
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
      
      // Reset the selection
      setSelectedEmployee("");
      setConvertingTicketId(null);
      
      alert("Ticket successfully converted to task!");
    } catch (error) {
      console.error("Error converting ticket:", error);
      alert("Failed to convert ticket. Please try again.");
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case StatusType.TO_DO:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case StatusType.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case StatusType.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold dark:text-white">Tickets Raised</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          View and manage tickets raised by customers
        </p>

        {tickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No customer tickets found
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </div>
                      {ticket.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {ticket.description}
                        </div>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      {/* <div className="text-sm text-gray-900 dark:text-white">
                        {ticket.userId?.name}
                      </div> */}
                      {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                        {ticket?.userId?.email || ""}
                      </div> */}
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {ticket.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {convertingTicketId === ticket._id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            className="text-sm border rounded p-1 dark:bg-gray-700 dark:border-gray-600"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                          >
                            <option value="">Select Employee</option>
                            {employees.map((employee) => (
                              <option key={employee._id} value={employee._id}>
                                {employee.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleConvertTicket(ticket._id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConvertingTicketId(null)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/convert-ticket/${ticket._id}`)}
                          className="text-indigo-600 text-centre hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Convert to Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsRaised;