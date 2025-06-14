import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ActivityDetailPage = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
          { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
        );
        setActivity(res.data.data);
      } catch (error) {
        console.error("Error fetching detail", error);
      }
    };

    fetchActivity();
  }, [id]);

  if (!activity) return <p>Loading...</p>;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>

      {/* Image */}
      <img
        src={activity.imageUrls[0]}
        alt={activity.title}
        className="w-full rounded-lg shadow-md mb-4"
      />

      {/* Info */}
      <div className="mb-4">
        <p className="text-lg text-gray-700">{activity.description}</p>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <strong>Price:</strong>{" "}
            <span className="text-green-600">
              Rp {activity.price.toLocaleString()}
            </span>
          </p>
          <p>
            <strong>Original Price:</strong>{" "}
            <span className="line-through text-gray-500">
              Rp {activity.price_discount.toLocaleString()}
            </span>
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {activity.rating} (
            {activity.total_reviews} reviews)
          </p>
          <p>
            <strong>Facilities:</strong> {activity.facilities}
          </p>
        </div>
        <div>
          <p>
            <strong>Address:</strong> {activity.address}
          </p>
          <p>
            <strong>City:</strong> {activity.city}
          </p>
          <p>
            <strong>Province:</strong> {activity.province}
          </p>
          <p>
            <strong>Category:</strong> {activity.category.name}
          </p>
          <img
            src={activity.category.imageUrl}
            alt={activity.category.name}
            className="w-32 rounded-md mt-2"
          />
        </div>
      </div>

      {/* Google Maps */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Location</h2>
        <div
          className="w-full h-[450px]"
          dangerouslySetInnerHTML={{ __html: activity.location_maps }}
        />
      </div>
    </div>
  );
};

export default ActivityDetailPage;
