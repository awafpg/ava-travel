import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    profilePictureUrl: null,
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ fetchProfile ~ res:", res);
      const user = res.data.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        profilePictureUrl: user.profilePictureUrl || "",
        phoneNumber: user.phoneNumber || "",
      });
      setPreview(user.profilePictureUrl);
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
      console.log("🚀 ~ fetchProfile ~ err?.response.data.:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("🚀 ~ handleImageChange ~ file:", file);
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("File tidak boleh lebih dari 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // base64
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("profilePictureUrl", preview);
      console.log("🚀 ~ handleSubmit ~ payload:", payload);
      console.log("🚀 ~ handleSubmit ~  fromdta:", formData);
      console.log(
        "🚀 ~ handleSubmit ~ formData.profilePictureUrl:",
        formData.profilePictureUrl
      );
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
        payload,
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(formData));

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err?.response.data.errors || "Something went wrong!!");
    } finally {
      setSaving(false);
      fileInputRef.current.value = ""; // reset input
      setPreview(null); // reset preview
      fetchProfile(); // re-fetch to update UI
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg font-medium mt-10">
        Loading profile...
      </p>
    );

  return (
    <>
      <div className="max-w-2xl mx-auto mt-10 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-center">My Profile</h2>

        {preview && (
          <div className="flex items-center gap-4 mb-4 p-8 rounded-md shadow-sm">
            {/* Profile Picture */}
            <div className="relative w-24 h-24">
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
                onError={(e) => {
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                }}
              />

              {/* Icon Camera */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
              >
                <Camera className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* Info Section */}
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {formData.name}
              </p>
              <p className="text-sm text-gray-600">{formData.email}</p>

              <span className="text-sm text-blue-500 font-medium capitalize">
                {formData.role || "user"}
              </span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded "
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Profile Picture</label>
            <input
              type="file"
              ref={fileInputRef}
              name="profilePictureUrl"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
