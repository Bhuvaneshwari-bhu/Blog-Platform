import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function CreatePost() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
      await api.post(
        "/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post Created");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.msg ||
        "Failed to create post"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-[#401E12] mb-2">
          Create New Post
        </h1>

        <p className="text-gray-500 mb-8">
          Share your thoughts, experiences, and ideas with the world.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium text-[#401E12]">
              Post Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter a catchy title..."
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-[#401E12]">
              Content
            </label>

            <textarea
              name="content"
              placeholder="Start writing your story..."
              rows="14"
              value={formData.content}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#401E12] text-[#FFA500] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}