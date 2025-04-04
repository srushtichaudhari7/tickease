import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import MyTasks from "./pages/MyTasks"; // Import MyTasks page
import ProtectedRoute from "./Components/ProtectedRoute";
import React from "react";
import TaskKanban from "./components/TaskKanban";
import TaskCalendar from "./components/TaskCalendar";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes for Employees */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute role="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected Routes for Employees */}
        <Route
          path="/employee-dashboard/my-tasks/"
          element={
            <ProtectedRoute role="Employee">
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard/my-tasks/kanban"
          element={
            <ProtectedRoute role="Employee">
              <TaskKanban />
            </ProtectedRoute>
          }
        />
         <Route
          path="/employee-dashboard/my-tasks/Calendar"
          element={
            <ProtectedRoute role="Employee">
              <TaskCalendar />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes for Customers */}
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute role="Customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        {/* Protected Routes for Employees */}
        <Route
          path="/employee-dashboard/projects/"
          element={
            <ProtectedRoute role="Employee">
              <Projects />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
