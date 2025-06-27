import axios from "axios";
import { ChevronDown, ShoppingCart } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen(!open);
  //   const cartsApi =
  //     "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts";
  //   const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  //   const token = localStorage.getItem("token");

  //   const fetchCarts = async () => {
  //     try {
  //       const res = await axios.get(cartsApi, {
  //         headers: {
  //           apiKey,
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const cart = res.data.data;
  //       console.log("🚀 ~ fetchCarts ~ cart:", cart);
  //     } catch (err) {
  //       toast.error(err?.message || "Something went wrong!");
  //     }
  //   };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("🚀 ~ handleLogout ~ res:", res);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    // fetchCarts();

    const loadUserFromStorage = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setFormData(user);
      }
    };

    // Load once on mount
    loadUserFromStorage();

    // Listen for storage changes across tabs
    window.addEventListener("storage", loadUserFromStorage);

    // Manual trigger in same tab
    const storageCheck = setInterval(loadUserFromStorage, 500);

    // Handle outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // ✅ Return one clean cleanup function
    return () => {
      window.removeEventListener("storage", loadUserFromStorage);
      clearInterval(storageCheck);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center gap-4 mx-4">
        {/* Shopping Cart */}
        <div className="relative">
          <button
            onClick={() => navigate("/cart")}
            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden 
  focus:outline-none hover:bg-gray-100 hover:text-blue-600 transition-all ease-in-out duration-200 transform hover:scale-130"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {localStorage.getItem("cartLength")}
          </span>
        </div>

        {/* Circle Profile */}
        <button
          onClick={toggleDropdown}
          className={`flex items-center gap-2 px-1 py-1 border-2 rounded-full transition-all duration-200
    ${isFocused ? "border-blue-500" : "border-gray-100"}
    hover:scale-105 focus:outline-none`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {/* Gambar profil, dibungkus lingkaran */}
          <div
            className={`w-10 h-10 rounded-full border-2 ${
              isFocused ? "border-blue-500" : "border-gray-300"
            } overflow-hidden`}
          >
            <img
              src={
                formData.profilePictureUrl instanceof File
                  ? URL.createObjectURL(formData.profilePictureUrl)
                  : formData.profilePictureUrl
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
              }}
            />
          </div>

          {/* Ikon panah */}
          <ChevronDown
            size={18}
            className={`${isFocused ? "text-blue-500" : "text-gray-500"}`}
          />
        </button>
      </div>
      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white  rounded-md shadow-lg z-50 p-4">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-3">
            <img
              src={formData.profilePictureUrl}
              alt="User"
              className="w-12 h-12 rounded-full object-cover border"
              onError={(e) => {
                e.target.src =
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
              }}
            />
            <div>
              <p className="font-semibold text-gray-800">{formData.name}</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <p className="text-xs text-blue-500 font-medium capitalize">
                {formData.role}
              </p>
            </div>
          </div>

          <hr className="my-2 text-gray-300" />

          {/* Menu Links */}
          <a
            href="/profile"
            className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded"
          >
            Profile
          </a>
          <a
            href="/cart"
            className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded"
          >
            Cart
          </a>
          <button
            onClick={() => handleLogout()}
            className="block w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
