import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import "./SuperAdminDashboard.css";

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
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name || opt.email || "N/A"}
        </option>
      ))}
    </select>
  );
}

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);

  const [newRoleName, setNewRoleName] = useState("");
  const [newPermissionName, setNewPermissionName] = useState("");

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        api.get("/roles"),
        api.get("/permissions"),
        api.get("/users"),
      ]);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const handleAddRole = async () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) return toast.error("Role name is required");
    try {
      setLoading(true);
      await api.post("/roles", { name: trimmedName });
      toast.success("Role added");
      setNewRoleName("");
      await fetchAllData();
    } catch (error) {
      console.error("Failed to add role:", error);
      toast.error(error.response?.data?.message || "Failed to add role");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async () => {
    if (!newPermissionName.trim())
      return toast.error("Permission name required");
    try {
      setLoading(true);
      await api.post("/permissions", { name: newPermissionName.trim() });
      toast.success("Permission created successfully");
      setNewPermissionName("");
      await fetchAllData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create permission"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermissionToRole = async () => {
    if (!selectedRole) return toast.error("Select a role");
    if (!selectedPermission) return toast.error("Select a permission");

    try {
      setLoading(true);
      await api.post(`/roles/${selectedRole}/permissions`, {
        permissionIds: [selectedPermission],
      });
      toast.success("Permission assigned to role");
      setSelectedPermission("");
      setSelectedRole("");
      await fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoleToUser = async () => {
    if (!selectedUser) return toast.error("Please select a user");
    if (!selectedUserRole) return toast.error("Please select a role");

    try {
      setLoading(true);
      await api.post(`/users/${selectedUser}/roles`, {
        roleIds: [selectedUserRole],
      });
      toast.success("Role assigned to user");
      setSelectedUser("");
      setSelectedUserRole("");
      await fetchAllData();
    } catch (error) {
      console.error("Failed to assign role to user:", error);
      toast.error(error.response?.data?.message || "Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  const rolesRef = useRef(null);
  const permissionsRef = useRef(null);
  const usersRef = useRef(null);
  const assignRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="admin-container">
        <div className="admin-inner">
          <h1 className="admin-title">Superadmin Panel</h1>

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
              <h3>Total Permissions</h3>
              <p>{permissions.length}</p>
            </div>
            <div className="stat-card">
              <h3>Logged in as</h3>
              <p>
                Logged in as{" "}
                {(user.name
                  ? user.name.charAt(0)
                  : user.email.charAt(0)
                ).toUpperCase()}
              </p>
              <small>
                {user.roles?.map((r) => r.name).join(", ") || "No role"}
              </small>
            </div>
          </div>

          {/* Quick Navigation Buttons */}
          <div className="nav-buttons" aria-label="Quick navigation buttons">
            <button onClick={() => scrollToSection(rolesRef)}>Roles</button>
            <button onClick={() => scrollToSection(permissionsRef)}>
              Permissions
            </button>
            <button onClick={() => scrollToSection(usersRef)}>Users</button>
            <button onClick={() => scrollToSection(assignRef)}>
              Assignments
            </button>
          </div>

          {/* Sections */}
          <section
            ref={rolesRef}
            className="section-card"
            aria-label="Add new role section"
          >
            <h2 className="section-title">Add New Role</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="input-text"
                disabled={loading}
                aria-label="Role Name"
              />
              <button
                onClick={handleAddRole}
                disabled={loading || !newRoleName.trim()}
                className="btn btn-blue"
                aria-label="Add Role"
              >
                Add Role
              </button>
            </div>
          </section>

          <section
            ref={permissionsRef}
            className="section-card"
            aria-label="Add new permission section"
          >
            <h2 className="section-title">Add New Permission</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Enter permission name"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                className="input-text"
                disabled={loading}
                aria-label="Permission Name"
              />
              <button
                onClick={handleAddPermission}
                disabled={loading || !newPermissionName.trim()}
                className="btn btn-blue"
                aria-label="Add Permission"
              >
                Add Permission
              </button>
            </div>
          </section>

          <section
            ref={assignRef}
            className="section-card"
            aria-label="Assign permission to role section"
          >
            <h2 className="section-title">Assign Permission to Role</h2>
            <div className="form-row">
              <Select
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={roles}
                disabled={loading}
              />
              <Select
                label="Permission"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                options={permissions}
                disabled={loading}
              />
              <button
                onClick={handleAssignPermissionToRole}
                disabled={loading || !selectedRole || !selectedPermission}
                className="btn btn-green"
                aria-label="Assign Permission"
              >
                Assign Permission
              </button>
            </div>
          </section>

          <section
            ref={usersRef}
            className="section-card"
            aria-label="Assign role to user section"
          >
            <h2 className="section-title">Assign Role to User</h2>
            <div className="form-row">
              <Select
                label="User"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                options={users}
                disabled={loading}
              />
              <Select
                label="Role"
                value={selectedUserRole}
                onChange={(e) => setSelectedUserRole(e.target.value)}
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

          <section className="section-card" aria-label="Roles overview section">
            <h2 className="section-title">Roles Overview</h2>
            {roles.length === 0 ? (
              <p className="no-data-text">No roles found</p>
            ) : (
              roles.map((role) => (
                <div key={role._id} className="role-card">
                  <strong className="role-name">{role.name}</strong>
                  <p className="role-permissions">
                    Permissions:{" "}
                    {role.permissions && role.permissions.length > 0
                      ? role.permissions.map((p) => p.name).join(", ")
                      : "None"}
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
