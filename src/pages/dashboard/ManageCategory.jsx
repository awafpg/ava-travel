import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories`, {
      headers: { apiKey: API_KEY },
    });
    const json = await res.json();
    setCategories(json.data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${BASE_URL}/api/v1/update-category/${editId}`
      : `${BASE_URL}/api/v1/create-category`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ name: "", imageUrl: "" });
    setIsEditing(false);
    setEditId(null);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, imageUrl: cat.imageUrl });
    setIsEditing(true);
    setEditId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await fetch(`${BASE_URL}/api/v1/delete-category/${id}`, {
      method: "DELETE",
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCategories();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Category</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-full"
        >
          {isEditing ? "Update" : "Create"} Category
        </button>
      </form>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="border p-4 rounded shadow">
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{cat.name}</h3>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
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

export default ManageCategory;
