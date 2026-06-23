import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-6xl mx-auto">
  
        <h1 className="text-5xl font-bold text-[#401E12] mb-3">
          Explore Blogs
        </h1>
  
        <p className="text-gray-600 mb-8">
          Discover stories, ideas and experiences.
        </p>
  
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
        />
  
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <p className="text-gray-500">
              No matching blogs found.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))
        )}
  
      </div>
    </div>
  );
}