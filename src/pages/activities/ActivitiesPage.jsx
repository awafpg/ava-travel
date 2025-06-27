import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { MapPin, ShoppingCart } from "lucide-react";
import { renderStars } from "../../utils/util";
import { toast } from "react-toastify";

const ActivitiesPage = () => {
  const location = useLocation();
  const categoryFromState = location.state?.category || "All";
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = localStorage.getItem("token");

  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromState);
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

  async function fetchCarts() {
    try {
      // Fetch cart items
      const cartRes = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cart = cartRes.data.data;

      localStorage.setItem("cartLength", cart.length);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  }

  const handleAddToCart = async (activityId) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const request = axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId },
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Added to cart:", request);
      fetchCarts();
      toast.success("Item berhasil ditambahkan!");
    } catch (error) {
      console.log("Add to cart failed:", error);
      toast.error("Failed to add activity to cart.");
    } finally {
      fetchCarts();
    }
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

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
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
        <div className="mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold mb-2 text-center">
            Explore Activities
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Explore our curated list of exciting activities to make your journey
            unforgettable.
          </p>

          {/* Filter Section */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search activities..."
            className="px-6 py-4 mb-6 rounded-md shadow-md w-full "
          />
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 rounded-md shadow-md"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mb-4">
              <label className="mr-2 text-xl text-gray-700">Show : </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="shadow-md rounded px-4 py-2"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
            </div>
          </div>

          {/* Activities List */}
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {paginatedActivities.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">
                No activities found.
              </p>
            ) : (
              paginatedActivities.map((activity) => (
                <Link
                  to={`/activities/${activity.id}`}
                  key={activity.id}
                  className=" rounded-xl shadow-lg bg-white flex flex-col hover:shadow-xl transition"
                >
                  {activity.imageUrls?.[0] && (
                    <img
                      src={activity.imageUrls[0]}
                      alt={activity.title}
                      onError={handleImageError}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                  )}
                  <div className="px-4">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                      {activity.title}
                    </h2>
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      Category: {activity.category?.name || "N/A"}
                    </p>

                    <p className="text-gray-700 mb-4">
                      {(() => {
                        const words = activity.description?.split(" ") || [];
                        const isLong = words.length > 8;
                        const displayed = words.slice(0, 8).join(" ");

                        return isLong ? `${displayed} ...` : displayed;
                      })()}
                    </p>
                    <div className="mb-4 flex gap-1">
                      <MapPin />
                      <p className="text-gray-700">{activity.province}</p>
                    </div>
                    <div className="mb-4 ">
                      <p className="flex items-center gap-2 text-yellow-500  font-semibold">
                        {renderStars(activity.rating)} {activity.rating}.0 (
                        {activity.total_reviews ?? "0"} reviews)
                      </p>
                      <div className="flex justify-between">
                        <p className="text-gray-900 font-semibold ">
                          <span className="text-blue-400 text-2xl">
                            Rp {activity.price?.toLocaleString()}
                          </span>
                          <span className="line-through text-red-500 px-2">
                            Rp {activity.price_discount?.toLocaleString()}
                          </span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // ⛔️ menghentikan event bubbling ke <Link>
                            e.preventDefault(); // ⛔️ mencegah redirect jika <button> ada dalam <a>
                            handleAddToCart(activity.id);
                          }}
                          className="flex items-center bg-blue-100 gap-1 text-blue-400 hover:bg-blue-400 hover:text-white rounded-xl px-3.5 py-2 transition"
                        >
                          <ShoppingCart />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
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
