import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);

      setFormData({
        title: res.data.title,
        content: res.data.content,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/posts/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post Updated");

      navigate(`/post/${id}`);
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-3xl mx-auto">
  
        <div className="bg-white rounded-2xl shadow-lg p-8">
  
          <h1 className="text-4xl font-bold text-[#401E12] mb-2">
            Edit Blog Post
          </h1>
  
          <p className="text-gray-600 mb-8">
            Update your article and save the changes.
          </p>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
  
            <div>
              <label className="block text-[#401E12] font-semibold mb-2">
                Title
              </label>
  
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              />
            </div>
  
            <div>
              <label className="block text-[#401E12] font-semibold mb-2">
                Content
              </label>
  
              <textarea
                rows="12"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FFA500] resize-none"
              />
            </div>
  
            <button
              type="submit"
              className="bg-[#401E12] text-[#FFA500] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
            >
              Update Post
            </button>
  
          </form>
  
        </div>
  
      </div>
    </div>
  );
}