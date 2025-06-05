import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  // Determine if user has these roles
  const isAdmin = user?.roles.some(r => ['superadmin', 'admin'].includes(r.name));

  return (
    <nav style={{ padding: '1rem', borderRight: '1px solid #ccc', height: '100vh' }}>
      <h2>App Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <NavLink to="/dashboard" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Dashboard
          </NavLink>
        </li>

        {isAdmin && (
          <li>
            <NavLink to="/admin" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
              Admin Panel
            </NavLink>
          </li>
        )}

        <li>
          <button onClick={logout} style={{ marginTop: '1rem' }}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
