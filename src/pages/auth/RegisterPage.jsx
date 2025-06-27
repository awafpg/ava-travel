import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "user",
    password: "",
    passwordRepeat: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordRepeat) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        passwordRepeat: form.passwordRepeat,
        role: form.role,
        phoneNumber: form.phoneNumber,
        profilePictureUrl:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
      };

      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register",
        payload,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      console.log("Register response:", response.data);
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/login", { state: { fromRegister: true } }),
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      console.error("Register error:", err.response?.data || err.message);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-auto px-4 py-10"
      style={{ backgroundImage: "url(/bg-travel.png)" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Floating Form with animation */}
      <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-6 animate-fadeIn transition duration-300">
        {/* Centered Form */}
        {/* <div className="relative z-10 w-full flex items-center justify-center px-4"> */}
        <div className="w-full max-w-md space-y-6 bg-white/40 rounded-xl shadow-lg p-8 mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="text"
                value={form.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                name="passwordRepeat"
                type="password"
                value={form.passwordRepeat}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center text-gray-700 text-sm mt-4">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
