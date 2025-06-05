import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await axios.get('/roles'); // baseURL configured in axios
        setRoles(response.data);
      } catch (err) {
        console.error('Failed to fetch roles', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  if (loading) return <div>Loading roles...</div>;

  return (
    <div>
      <h2>Roles</h2>
      <ul>
        {roles.map(role => (
          <li key={role._id}>
            <strong>{role.name}</strong>
            <ul>
              {role.permissions?.map(p => (
                <li key={p._id}>{p.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
