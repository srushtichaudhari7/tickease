import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import MyTasks from "./pages/MyTasks";
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import TaskKanban from "./components/TaskKanban";
import TaskCalendar from "./components/TaskCalendar";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Members from "./pages/Members";
import CreateIssue from "./components/CreateIssue.jsx";
import UserType from "./constants/user.types";
import TaskDetails from "./components/TaskDetails";
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Employee Portal Routes - Grouped for clarity */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/projects"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/my-tasks"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <MyTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/my-tasks/:taskId"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <TaskDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/my-tasks/kanban"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <TaskKanban />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/my-tasks/calendar"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <TaskCalendar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-dashboard/members"
        element={
          <ProtectedRoute role={UserType.EMPLOYEE}>
            <Members />
          </ProtectedRoute>
        }
      />

      {/* Customer Portal Routes - Grouped for clarity */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute role={UserType.CUSTOMER}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Add missing customer routes */}
      <Route
        path="/customer-dashboard/create-issue"
        element={
          <ProtectedRoute role={UserType.CUSTOMER}>
            <CreateIssue />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
