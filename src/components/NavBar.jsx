import React, { useState } from "react";
import logo from "../../public/logo.png"; // Adjust the path as necessary
import { Menu, X } from "lucide-react";
import AuthButtons from "./AuthButton";
import ProfileDropdown from "./ProfileDropDown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = ["Home", "Activities", "Categories", "Promo"];

  // Check for token in localStorage
  const token = localStorage.getItem("token");

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
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
          {token ? (
            <ProfileDropdown />
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                Register
              </button>
            </>
          )}
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
        <div className="md:hidden flex justify-between px-4 pb-4 space-y-2 bg-white shadow-md">
          <div>
            {links.map((link) => (
              <a
                key={link}
                href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="block text-gray-600 hover:text-blue-600"
              >
                {link}
              </a>
            ))}
          </div>
          <div>
            {token ? (
              <ProfileDropdown />
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="block w-full mb-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="block w-full px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
