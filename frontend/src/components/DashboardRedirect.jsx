import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    // Show loading while user data fetches or auth is initializing
    return <p>Loading user data...</p>;
  }

  const roles = user.roles?.map(r => r.name) || [];

  if (roles.includes("superadmin")) {
    // Redirect superadmin to dedicated route to avoid redirect loops
    return <Navigate to="/superadmin" replace />;
  }

  if (roles.includes("admin")) {
    return <Navigate to="/admin" replace />;
  }

  if (roles.includes("user")) {
    return <Navigate to="/user" replace />;
  }

  // No roles matched: unauthorized access
  return <Navigate to="/unauthorized" replace />;
}
