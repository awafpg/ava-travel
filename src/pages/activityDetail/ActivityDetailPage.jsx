import axios from "axios";
import {
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Share2,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { renderStars } from "../../utils/util";
import { toast } from "react-toastify";

const ActivityDetailPage = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Minimal 1

  const dummyReviews = [
    {
      name: "Alice Johnson",
      stars: 5,
      comment:
        "Amazing experience! Everything was well-organized and beautiful.",
    },
    {
      name: "Bob Smith",
      stars: 4,
      comment: "Great value and friendly staff, just a bit crowded.",
    },
    {
      name: "Clara Reyes",
      stars: 5,
      comment: "I loved it! Will definitely come back with my family.",
    },
    {
      name: "Daniel Lee",
      stars: 4,
      comment: "Good place overall, but parking was hard to find.",
    },
  ];
  const handleAddToCart = async (activityId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const requests = [];
      for (let i = 0; i < quantity; i++) {
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
        requests.push(request);
      }

      await Promise.all(requests);
      toast.success(
        "Item berhasil ditambahkan sebanyak " + quantity + " kali!"
      );
      console.log("Added to cart:", requests.data);
      navigate("/cart");
    } catch (error) {
      console.log("Add to cart failed:", error);
      toast.error("Failed to add activity to cart.");
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
          { headers: { apiKey } }
        );
        setActivity(res.data.data);
      } catch (error) {
        console.error("Error fetching detail", error);
      }
    };

    fetchActivity();
  }, [id]);

  if (!activity) return <p>Loading...</p>;
  console.log(activity, "act");

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Detail Content (2/3 width) */}
        <div className="md:col-span-2">
          <img
            src={activity.imageUrls[0]}
            alt={activity.title}
            className="w-full rounded-lg shadow-md mb-4"
          />
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>

            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              {renderStars(activity.rating)}
              <span className="text-gray-800 font-medium">
                {activity.rating} ({activity.total_reviews} reviews)
              </span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={18} />
              <span>
                {activity.city}, {activity.province}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h2 className="font-semibold text-lg mb-1">Description</h2>
            <p className="text-gray-700">
              {activity.description || "tidak ada"}
            </p>
          </div>

          {/* Facilities & Services */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h2 className="font-semibold text-lg mb-1">
              Facilities & Services
            </h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: activity.facilities || "tidak ada",
              }}
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow p-4 mb-10">
            <h2 className="font-semibold text-lg mb-2">Location</h2>
            <div
              className="w-full h-[450px] rounded overflow-hidden"
              dangerouslySetInnerHTML={{ __html: activity.location_maps }}
            />
          </div>
          {/* review */}
          <div className=" mx-auto mt-10 p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">
              Reviews ({activity.total_reviews})
            </h2>

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-blue-600">
                  {activity.rating}.0
                </p>
                {renderStars(activity.rating)}
                <span className="text-sm text-gray-600">
                  {activity.total_reviews} reviews
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm mt-2 text-gray-600 flex-wrap">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    {star}
                    <Star size={14} className="text-yellow-400" />
                    {["70%", "20%", "8%", "2%", "0%"][i]}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-6">
              {dummyReviews.map((review, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <User className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <CalendarDays size={14} />
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-11 mb-1">{renderStars(review.stars)}</div>
                  <p className="ml-11 text-gray-700 text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl shadow-md p-6 w-full">
            {/* Harga */}
            <p className="text-3xl text-blue-600 font-bold mb-4">
              Rp {activity.price.toLocaleString()}
            </p>

            {/* Tanggal */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <CalendarDays className="text-gray-400 mr-2" size={18} />
                <input
                  type="date"
                  className="w-full text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <User className="text-gray-400 mr-2" size={18} />
                <span className="text-sm text-gray-700">1 Person</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decreaseQty}
                  className="w-10 text-xl text-gray-500 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="flex-1 text-center py-2 text-sm">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="w-10 text-xl text-gray-500 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tombol Add to Cart */}
            <button
              onClick={() => {
                handleAddToCart(activity.id);
              }}
              className="bg-blue-600 text-white py-2 rounded-md w-full font-medium text-sm flex justify-center items-center gap-2 hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            {/* Tombol Favorite & Share */}
            <div className="flex justify-between mt-4 gap-2">
              <button className="flex-1 border border-gray-300 py-2 rounded-md text-sm text-gray-700 flex justify-center items-center gap-2 hover:bg-gray-100">
                <Heart className="w-4 h-4" />
                Favorite
              </button>
              <button className="flex-1 border border-gray-300 py-2 rounded-md text-sm text-gray-700 flex justify-center items-center gap-2 hover:bg-gray-100">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Highlights */}
            <div>
              <h3 className="font-semibold mb-2">Activity Highlights</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2 ">
                  <Check className="w-4 h-4 text-green-600" /> Instant
                  Confirmation
                </li>
                <li className="flex items-center gap-2 ">
                  <Check className="w-4 h-4 text-green-600" /> Flexible
                  Cancellation
                </li>
                <li className="flex items-center gap-2 ">
                  <Check className="w-4 h-4 text-green-600" /> Skip the line
                  access
                </li>
                <li className="flex items-center gap-2 ">
                  <Check className="w-4 h-4 text-green-600" /> Duration: Full
                  day
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
