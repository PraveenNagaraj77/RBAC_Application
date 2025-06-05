import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

function Select({ label, value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={label}
      className="input-select"
    >
      <option value="">{`Select ${label}`}</option>
      {options.map(opt => (
        <option key={opt._id} value={opt._id}>
          {opt.name || opt.email || 'N/A'}
        </option>
      ))}
    </select>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [rolesRes, usersRes] = await Promise.all([
        api.get('/roles'),
        api.get('/users'),
      ]);
      setRoles(rolesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const handleAssignRoleToUser = async () => {
    if (!selectedUser) return toast.error('Please select a user');
    if (!selectedUserRole) return toast.error('Please select a role');

    try {
      setLoading(true);
      await api.post(`/users/${selectedUser}/roles`, { roleIds: [selectedUserRole] });
      toast.success('Role assigned to user');
      setSelectedUser('');
      setSelectedUserRole('');
      await fetchData();
    } catch (error) {
      console.error('Failed to assign role to user:', error);
      toast.error(error.response?.data?.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="admin-container">
        <div className="admin-inner">
          <h1 className="admin-title">Admin Panel</h1>

          {/* Loading */}
          {loading && <p className="loading-text">Loading...</p>}

          {/* Statistics Cards */}
          <div className="stats-container" aria-label="Dashboard statistics">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Roles</h3>
              <p>{roles.length}</p>
            </div>
            <div className="stat-card">
              <h3>Logged in as</h3>
              <p>
                {(user.name ? user.name.charAt(0) : user.email.charAt(0)).toUpperCase()}
              </p>
              <small>{user.roles?.map(r => r.name).join(', ') || 'No role'}</small>
            </div>
          </div>

          {/* Assign Role to User */}
          <section className="section-card" aria-label="Assign role to user section">
            <h2 className="section-title">Assign Role to User</h2>
            <div className="form-row">
              <Select
                label="User"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                options={users}
                disabled={loading}
              />
              <Select
                label="Role"
                value={selectedUserRole}
                onChange={e => setSelectedUserRole(e.target.value)}
                options={roles}
                disabled={loading}
              />
              <button
                onClick={handleAssignRoleToUser}
                disabled={loading || !selectedUser || !selectedUserRole}
                className="btn btn-purple"
                aria-label="Assign Role to User"
              >
                Assign Role
              </button>
            </div>
          </section>

          {/* Roles Overview */}
          <section className="section-card" aria-label="Roles overview section">
            <h2 className="section-title">Roles Overview</h2>
            {roles.length === 0 ? (
              <p className="no-data-text">No roles found</p>
            ) : (
              roles.map(role => (
                <div key={role._id} className="role-card">
                  <strong className="role-name">{role.name}</strong>
                  <p className="role-permissions">
                    Permissions:{' '}
                    {role.permissions && role.permissions.length > 0
                      ? role.permissions.map(p => p.name).join(', ')
                      : 'None'}
                  </p>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </>
  );
}
