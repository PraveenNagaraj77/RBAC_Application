import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  const roleNames = user.roles?.map(role => role.name) || [];
  const permissionNames = user.permissions?.map(p => p.name) || [];

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="user-container">
        <div className="user-inner">
          <h1>User Dashboard</h1>
          <p>Welcome, <strong>{user.email}</strong></p>

          <section className="section">
            <h3>Your Roles</h3>
            {roleNames.length ? (
              roleNames.map(role => (
                <span key={role} className="badge">{role}</span>
              ))
            ) : (
              <p>No roles assigned</p>
            )}
          </section>

          <section className="section">
            <h3>Your Permissions</h3>
            {permissionNames.length ? (
              permissionNames.map(perm => (
                <span key={perm} className="badge">{perm}</span>
              ))
            ) : (
              <p>No permissions assigned</p>
            )}
          </section>

          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
