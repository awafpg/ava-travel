import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleImageError = (e) => {
    e.target.src =
      "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const data = res.data.data;
        setCategories(data);
        setFeatured(data[0]); // Pick the first category as featured
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Explore Categories</h1>

      {/* Featured Category */}
      {featured && (
        <div className="mb-10 bg-blue-50 rounded-lg overflow-hidden shadow-md">
          <img
            src={featured.imageUrl}
            onError={handleImageError}
            alt={featured.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold">{featured.name}</h2>
            <p className="text-gray-600 mt-2">
              Featured destination: {featured.name}
            </p>
            <Link
              to="/activities"
              state={{ category: featured.name }}
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Activities
            </Link>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {paginatedCategories.map((cat) => (
          <Link
            key={cat.id}
            to="/activities"
            state={{ category: cat.name }}
            className="bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={cat.imageUrl}
              onError={handleImageError}
              alt={cat.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;
