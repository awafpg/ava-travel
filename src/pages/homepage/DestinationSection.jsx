import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  if (loading || !current || !current.imageUrl) {
    return (
      <section className="py-12">
        <p className="text-center text-lg font-medium mt-8">
          Loading destinations...
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full flex flex-col justify-center items-center py-0 min-h-screen">
      {/* Wide background image with overlay, not fixed */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={current.imageUrl}
          alt={current.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
          }}
          className="w-full h-full object-cover object-center rounded-none"
        />
        <div className="absolute inset-0 bg-black/40 bg-opacity-30" />
      </div>

      {/* Content on top of the image */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-overlay"}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 items-start px-6 py-6 w-1/4 min-w-[260px] max-w-xs  rounded-lg"
          >
            <h1 className="text-xl font-bold text-white drop-shadow">
              {current.name}
            </h1>
            <h2 className="text-md font-semibold text-white drop-shadow mb-1">
              Indonesia
            </h2>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                3 Days
              </span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                4.9 (124)
              </span>
            </div>
            <p className="text-sm text-white mb-2 drop-shadow">
              Discover amazing destinations and unforgettable experiences
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-yellow-300 drop-shadow">
                Rp 999.000
              </span>
              <span className="text-base text-white/70 line-through">
                Rp 1.299.000
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10 w-full px-1">
          <button
            onClick={() =>
              setCurrentIndex(
                currentIndex === 0 ? destinations.length - 1 : currentIndex - 1
              )
            }
            className="p-1 rounded-full bg-gray-900/60 hover:bg-gray-900/80 text-white shadow flex justify-center items-center"
            aria-label="Previous"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((currentIndex + 1) % destinations.length)
            }
            className="p-1 rounded-full bg-gray-900/60 hover:bg-gray-900/80 text-white shadow flex justify-center items-center"
            aria-label="Next"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      {/* Nomor urut di bawah gambar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <p className="text-base text-gray-200 font-small drop-shadow bg-black/40 px-4 py-2 rounded-full">
          {currentIndex + 1} / {destinations.length}
        </p>
      </div>
    </section>
  );
}
