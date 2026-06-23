import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function MyPosts() {
  const { token } = useAuth();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get(
        "/posts/my-posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#401E12]">
            My Blogs
          </h1>

          <p className="text-gray-600 mt-2">
            Manage and view all your published posts.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <p className="text-lg text-[#401E12]">
            Total Posts:{" "}
            <span className="font-bold text-[#FFA500]">
              {posts.length}
            </span>
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#401E12]">
              No Blogs Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Create your first blog post and start sharing your ideas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}