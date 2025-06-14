import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/footer";
import Navbar from "../../components/NavBar";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        };

        const [activitiesRes, categoriesRes] = await Promise.all([
          axios.get(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
            { headers }
          ),
          axios.get(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
            { headers }
          ),
        ]);

        const rawActivities = activitiesRes.data.data || [];
        const fetchedCategories = categoriesRes.data.data || [];

        const cleanedActivities = rawActivities
          .filter(
            (activity) =>
              activity.title?.trim() &&
              activity.description?.trim() &&
              activity.imageUrls &&
              activity.imageUrls.length > 0 &&
              activity.imageUrls[0]?.startsWith("http")
          )
          .map((activity) => ({
            ...activity,
            title: activity.title.trim(),
            description: activity.description.trim(),
          }));

        setActivities(cleanedActivities);
        setCategories(fetchedCategories);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Filter by category and search
  const filteredActivities = activities.filter((activity) => {
    const matchesCategory =
      selectedCategory === "All" ||
      activity.category?.name === selectedCategory;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleImageError = (e) => {
    e.target.src =
      "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  if (loading)
    return (
      <p className="text-center mt-8 text-lg font-semibold">
        Loading activities...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-8 text-red-600 font-semibold">{error}</p>
    );

  return (
    <>
      {/* Konten utama dengan grow */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Activities</h1>

          {/* Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 border rounded-md shadow-md"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search activities..."
              className="px-4 py-2 border rounded-md shadow-md w-full md:w-1/2"
            />
          </div>

          {/* Activities List */}
          <div className="grid gap-10 md:grid-cols-2">
            {paginatedActivities.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">
                No activities found.
              </p>
            ) : (
              paginatedActivities.map((activity) => (
                <Link
                  to={`/activities/${activity.id}`}
                  key={activity.id}
                  className="border rounded-xl shadow-lg p-6 bg-white flex flex-col hover:shadow-xl transition"
                >
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                    {activity.title}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 mb-2">
                    Category: {activity.category?.name || "N/A"}
                  </p>

                  {activity.imageUrls?.[0] && (
                    <img
                      src={activity.imageUrls[0]}
                      alt={activity.title}
                      onError={handleImageError}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div className="mb-4">
                    <p className="text-gray-900 font-semibold">
                      Price:
                      <span className="line-through text-red-500 mr-2">
                        Rp {activity.price_discount?.toLocaleString()}
                      </span>
                      <span>Rp {activity.price?.toLocaleString()}</span>
                    </p>
                    <p className="text-yellow-500 font-semibold">
                      Rating: {activity.rating} ⭐ ({activity.total_reviews}{" "}
                      reviews)
                    </p>
                  </div>
                  <p className="text-gray-700 mb-4">{activity.description}</p>
                  <div className="mb-4">
                    <p className="text-gray-600 font-medium">Address:</p>
                    <p className="text-gray-700">{activity.address}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination controls */}
          {filteredActivities.length > 0 && (
            <div className="flex justify-center mt-10 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ActivitiesPage;
