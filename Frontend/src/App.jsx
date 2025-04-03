import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/employee-dashboard"
          element={<ProtectedRoute role="Employee"><EmployeeDashboard /></ProtectedRoute>}
        />
        <Route
          path="/customer-dashboard"
          element={<ProtectedRoute role="Customer"><CustomerDashboard /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;