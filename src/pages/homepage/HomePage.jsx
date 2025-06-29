import React from "react";
import Navbar from "../../components/NavBar";
import BannerList from "./DestinationSection";
import DestinationSection from "./DestinationSection";
import Footer from "../../components/footer";
import PromoSection from "./PromoSection";

export const HomePage = () => {
  const handleActivities = () => {
    window.location.href = "/activities";
  };

  return (
    <div>
      <header className="bg-white py-16" id="home">
        <div className="max-w-7xl p-6 mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Left Side: Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Discover Amazing <br /> Travel Destinations
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600">
              Explore, document, and share your journeys with the world.
            </p>
            <button
              onClick={handleActivities}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1">
            <img
              src="/header.png"
              alt="Travel header"
              className="w-full rounded-xl "
            />
          </div>
        </div>
      </header>
      <section id="destinations" aria-label="Destinations" className="mx-auto">
        <DestinationSection />
        <PromoSection />
      </section>
    </div>
  );
};
