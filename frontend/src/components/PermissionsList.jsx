import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PermissionsList() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await axios.get('/permissions');
        setPermissions(response.data);
      } catch (err) {
        console.error('Failed to fetch permissions', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPermissions();
  }, []);

  if (loading) return <div>Loading permissions...</div>;

  return (
    <div>
      <h2>Permissions</h2>
      <ul>
        {permissions.map(p => (
          <li key={p._id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
