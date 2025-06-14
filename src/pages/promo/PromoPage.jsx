import React, { useEffect, useState } from "react";
import axios from "axios";

const PromoPage = () => {
  const [promos, setPromos] = useState([]);
  const [featured, setFeatured] = useState(null);

  const handleImageError = (e) => {
    e.target.src =
      "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=2112&auto=format&fit=crop";
  };

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const promoList = response.data.data;
        setPromos(promoList);
        setFeatured(promoList[0]); // First item as featured
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    };

    fetchPromos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎁 Promo & Deals</h1>

      {/* Featured Promo */}
      {featured && (
        <div className="mb-10 rounded-lg shadow-lg overflow-hidden bg-blue-50">
          <img
            src={featured.imageUrl}
            onError={handleImageError}
            alt={featured.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold">{featured.title}</h2>
            <p className="text-gray-700 mt-2">{featured.description}</p>
            <p className="mt-4">
              <strong>Promo Code:</strong>{" "}
              <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">
                {featured.promo_code}
              </span>
            </p>
            <p>
              <strong>Discount:</strong>{" "}
              <span className="text-green-600 font-bold">
                Rp {featured.promo_discount_price.toLocaleString()}
              </span>
            </p>
            <p>
              <strong>Min. Spend:</strong> Rp{" "}
              {featured.minimum_claim_price.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* List of Promos */}
      <div className="grid md:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={promo.imageUrl}
              onError={handleImageError}
              alt={promo.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{promo.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {promo.description.length > 80
                  ? promo.description.slice(0, 80) + "..."
                  : promo.description}
              </p>
              <p>
                <strong>Promo Code:</strong>{" "}
                <span className="text-blue-700 font-mono">
                  {promo.promo_code}
                </span>
              </p>
              <p>
                <strong>Discount:</strong> Rp{" "}
                {promo.promo_discount_price.toLocaleString()}
              </p>
              <p>
                <strong>Min. Price:</strong> Rp{" "}
                {promo.minimum_claim_price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoPage;
