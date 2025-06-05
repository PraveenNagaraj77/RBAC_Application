import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Unauthorized from "./pages/Unauthorized";
import DashboardRedirect from "./components/DashboardRedirect";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard redirect based on role */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["superadmin", "admin", "user"]}>
                  <DashboardRedirect />
                </PrivateRoute>
              }
            />

            {/* Role-specific dashboards */}
            <Route
              path="/superadmin"
              element={
                <PrivateRoute allowedRoles={["superadmin"]}>
                  <SuperAdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all other paths */}
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
