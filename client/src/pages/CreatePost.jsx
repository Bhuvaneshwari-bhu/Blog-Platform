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
    <div>
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="content"
          placeholder="Write your blog..."
          rows="8"
          cols="40"
          value={formData.content}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
}