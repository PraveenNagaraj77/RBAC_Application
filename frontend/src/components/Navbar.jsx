import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="nav-button"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>

        {(user?.roles?.some(r => r.name === 'admin' || r.name === 'superadmin')) && (
          <button
            className="nav-button"
            onClick={() => navigate('/admin')}
          >
            Admin
          </button>
        )}

        {user?.roles?.some(r => r.name === 'user') && (
          <button
            className="nav-button"
            onClick={() => navigate('/user')}
          >
            User
          </button>
        )}
      </div>

      <div className="navbar-right">
        <button className="nav-button logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
