import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PromoSection() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const promosPerPage = 6;

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
        setPromos(response.data.data);
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading promos...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(promos.length / promosPerPage);
  const startIndex = (currentPage - 1) * promosPerPage;
  const currentPromos = promos.slice(startIndex, startIndex + promosPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <section className="py-10 px-4 md:px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">🎉 Promo Terbaru</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPromos.map((promo) => (
          <div
            key={promo.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{promo.description}</p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Kode Promo:</strong> {promo.promo_code}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Diskon:</strong> Rp
                {promo.promo_discount_price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Min. Transaksi:</strong> Rp
                {promo.minimum_claim_price.toLocaleString()}
              </p>
              <div
                className="text-xs text-gray-500"
                dangerouslySetInnerHTML={{ __html: promo.terms_condition }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅️ Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next ➡️
        </button>
      </div>
    </section>
  );
}
