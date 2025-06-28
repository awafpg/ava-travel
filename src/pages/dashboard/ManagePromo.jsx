import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000"; // ganti dengan URL produksi jika sudah deploy

const ManagePromo = () => {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all promos
  const fetchPromos = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/promos`, {
      headers: { apiKey: API_KEY },
    });
    const json = await res.json();
    setPromos(json.data || []);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${BASE_URL}/api/v1/update-promo/${editId}`
      : `${BASE_URL}/api/v1/create-promo`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        promo_discount_price: Number(form.promo_discount_price),
        minimum_claim_price: Number(form.minimum_claim_price),
      }),
    });

    setForm({
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setIsEditing(false);
    setEditId(null);
    fetchPromos();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promo?")) return;

    await fetch(`${BASE_URL}/api/v1/delete-promo/${id}`, {
      method: "DELETE",
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPromos();
  };

  const handleEdit = (promo) => {
    setForm({
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setIsEditing(true);
    setEditId(promo.id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Promo</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />
        <input
          name="promo_code"
          value={form.promo_code}
          onChange={handleChange}
          placeholder="Promo Code"
          className="border p-2 rounded"
          required
        />
        <input
          name="promo_discount_price"
          type="number"
          value={form.promo_discount_price}
          onChange={handleChange}
          placeholder="Discount Price"
          className="border p-2 rounded"
          required
        />
        <input
          name="minimum_claim_price"
          type="number"
          value={form.minimum_claim_price}
          onChange={handleChange}
          placeholder="Minimum Claim Price"
          className="border p-2 rounded"
          required
        />
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded col-span-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded col-span-full"
          required
        />
        <textarea
          name="terms_condition"
          value={form.terms_condition}
          onChange={handleChange}
          placeholder="Terms & Conditions"
          className="border p-2 rounded col-span-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-full"
        >
          {isEditing ? "Update Promo" : "Create Promo"}
        </button>
      </form>

      {/* Promo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div key={promo.id} className="border rounded shadow p-4">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold text-lg">{promo.title}</h3>
            <p className="text-sm">Code: {promo.promo_code}</p>
            <p className="text-sm">
              Discount: Rp{promo.promo_discount_price.toLocaleString()}
            </p>
            <p className="text-sm">
              Min. Claim: Rp{promo.minimum_claim_price.toLocaleString()}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(promo)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
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

export default ManagePromo;
