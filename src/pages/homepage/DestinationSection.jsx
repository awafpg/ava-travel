import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function DestinationSection() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const validData = response.data.data.filter(
          (item) => item.imageUrl?.trim() !== "" && item.name?.trim() !== ""
        );

        setDestinations(validData);
      } catch (error) {
        console.error(
          "Error fetching destinations:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    if (destinations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [destinations]);

  const current = destinations[currentIndex];

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (loading) {
    return (
      <section className="py-12">
        <p className="text-center text-lg font-medium mt-8">
          Loading destinations...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto py-12 text-center">
      <h2 className="text-4xl font-bold mb-10 text-gray-900">
        Explore Our Destinations
      </h2>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1 }}
            className="border rounded-2xl shadow-xl p-6 bg-white"
          >
            <h3 className="text-2xl font-semibold text-gray-800">
              {current.name}
            </h3>
            <p className="text-gray-600 mt-2">{current.description}</p>
            <img
              src={current.imageUrl}
              alt={current.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
              }}
              className="w-full h-[400px] mt-6 object-cover rounded-md"
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button
            onClick={() =>
              setCurrentIndex(
                currentIndex === 0 ? destinations.length - 1 : currentIndex - 1
              )
            }
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            ⬅️ Previous
          </button>
          <button
            onClick={() =>
              setCurrentIndex((currentIndex + 1) % destinations.length)
            }
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Next ➡️
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          {currentIndex + 1} / {destinations.length}
        </p>
      </div>
    </section>
  );
}
