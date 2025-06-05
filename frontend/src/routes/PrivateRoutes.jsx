import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !user.roles.some(role => allowedRoles.includes(role.name))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
