import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
      const res = await api.post(
        "/auth/login",
        formData
      );

      login(
        res.data.token,
        res.data.user
      );

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.msg ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FFF8F3] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-[#401E12] mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to continue your blogging journey
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#401E12] text-[#FFA500] py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#5A2B1B] font-semibold hover:text-[#FFA500]"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}