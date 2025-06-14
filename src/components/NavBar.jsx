import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Home", "Activities", "Categories", "Promo"];

  const handleLogin = () => {
    // Replace with your actual login page URL
    window.location.href = "/login";
  };

  const handleRegister = () => {
    // Replace with your actual register page URL
    window.location.href = "/register";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex gap-1 justify-center items-center">
          <img src={logo} alt="logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold text-blue-600">AVA Travel</h1>
        </div>
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <a
              key={link}
              href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="hidden md:flex space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block text-gray-600 hover:text-blue-600"
            >
              {link}
            </a>
          ))}
          <div className="space-y-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
