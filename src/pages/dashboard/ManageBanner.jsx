import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000";

const ManageBanner = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/banners`, {
      headers: {
        apiKey: API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => setBanners(data.data || []));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${BASE_URL}/api/v1/update-banner/${editId}`
      : `${BASE_URL}/api/v1/create-banner`;

    const method = "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    window.location.reload(); // simple reload for update
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    await fetch(`${BASE_URL}/api/v1/delete-banner/${id}`, {
      method: "DELETE",
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEdit = (banner) => {
    setForm({ name: banner.name, imageUrl: banner.imageUrl });
    setIsEditing(true);
    setEditId(banner.id);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Banners</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Banner Name"
          value={form.name}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Update" : "Create"} Banner
        </button>
      </form>

      {/* Banner List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="border p-4 rounded shadow">
            <img
              src={banner.imageUrl}
              alt={banner.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold">{banner.name}</h3>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(banner)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBanner;
