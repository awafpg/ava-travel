import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000";

const ManageActivity = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: "",
    price: "",
    price_discount: "",
    rating: "",
    total_reviews: "",
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchActivities = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/activities`, {
      headers: { apiKey: API_KEY },
    });
    const json = await res.json();
    setActivities(json.data || []);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${BASE_URL}/api/v1/update-activity/${editId}`
      : `${BASE_URL}/api/v1/create-activity`;

    const payload = {
      ...form,
      price: parseInt(form.price),
      price_discount: parseInt(form.price_discount),
      rating: parseFloat(form.rating),
      total_reviews: parseInt(form.total_reviews),
      imageUrls: form.imageUrls.split(",").map((url) => url.trim()),
    };

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setForm({
      categoryId: "",
      title: "",
      description: "",
      imageUrls: "",
      price: "",
      price_discount: "",
      rating: "",
      total_reviews: "",
      facilities: "",
      address: "",
      province: "",
      city: "",
      location_maps: "",
    });
    setIsEditing(false);
    setEditId(null);
    fetchActivities();
  };

  const handleEdit = (act) => {
    setForm({
      ...act,
      imageUrls: act.imageUrls?.join(", "),
    });
    setIsEditing(true);
    setEditId(act.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;

    await fetch(`${BASE_URL}/api/v1/delete-activity/${id}`, {
      method: "DELETE",
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    fetchActivities();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Activities</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          placeholder="Category ID"
          className="border p-2 rounded"
          required
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
          required
        />
        <input
          name="price_discount"
          type="number"
          value={form.price_discount}
          onChange={handleChange}
          placeholder="Discount Price"
          className="border p-2 rounded"
        />
        <input
          name="rating"
          type="number"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating (e.g. 4.5)"
          className="border p-2 rounded"
        />
        <input
          name="total_reviews"
          type="number"
          value={form.total_reviews}
          onChange={handleChange}
          placeholder="Total Reviews"
          className="border p-2 rounded"
        />
        <input
          name="imageUrls"
          value={form.imageUrls}
          onChange={handleChange}
          placeholder="Image URLs (comma separated)"
          className="border p-2 rounded col-span-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded col-span-full"
        />
        <textarea
          name="facilities"
          value={form.facilities}
          onChange={handleChange}
          placeholder="Facilities (HTML)"
          className="border p-2 rounded col-span-full"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded col-span-full"
        />
        <input
          name="province"
          value={form.province}
          onChange={handleChange}
          placeholder="Province"
          className="border p-2 rounded"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 rounded"
        />
        <textarea
          name="location_maps"
          value={form.location_maps}
          onChange={handleChange}
          placeholder="Embed Maps HTML"
          className="border p-2 rounded col-span-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-full"
        >
          {isEditing ? "Update" : "Create"} Activity
        </button>
      </form>

      {/* Activity List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div key={act.id} className="border p-4 rounded shadow">
            <img
              src={act.imageUrls?.[0]}
              alt={act.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{act.title}</h3>
            <p className="text-sm text-gray-600">
              Price: Rp{act.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Rating: {act.rating} ⭐</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(act)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(act.id)}
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

export default ManageActivity;
