import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.msg ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFF8F3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-[#401E12] mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join BlogSphere and start sharing your ideas
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium text-[#401E12]">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#401E12]">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#401E12]">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#401E12] text-[#FFA500] py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#5A2B1B] font-semibold hover:text-[#FFA500]"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}