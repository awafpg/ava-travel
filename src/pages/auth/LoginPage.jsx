import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
        { email, password },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      console.log("Login success:", response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      toast.success("Login successful!");
      setTimeout(() => {
        if (fromRegister) {
          navigate("/");
        } else navigate(-1);
      }, 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/bg-travel.png")' }}
      >
        <div className="backdrop-blur-md bg-white/30 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="text-center text-white text-sm mt-4">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-blue-200 hover:underline font-semibold"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
