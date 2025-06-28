import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000"; // ganti ke URL produksi jika perlu

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/all-user`, {
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    setUsers(json.data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await fetch(`${BASE_URL}/api/v1/update-user-role/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    fetchUsers();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow">
            <img
              src={user.profilePictureUrl}
              alt={user.email}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-lg">
              {user.name || "(No name)"}
            </h3>
            <p className="text-sm text-gray-600">📧 {user.email}</p>
            <p className="text-sm text-gray-600">📱 {user.phoneNumber}</p>
            <p className="text-sm mt-1">
              Role: <strong>{user.role}</strong>
            </p>

            <div className="mt-2">
              <label className="text-sm">Change Role:</label>
              <select
                className="w-full border p-1 mt-1 rounded"
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUser;
