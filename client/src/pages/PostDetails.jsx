import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token,user } = useAuth();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);

      setPost(res.data);
      setLikes(res.data.likes?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) {
    return <h2>Loading...</h2>;
  }
  console.log(post.author);
  const isOwner =
  user &&
  post.author &&
  user.id === post.author._id;

  const handleLike = async () => {
    try {
      const res = await api.post(
        `/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setLikes(res.data.likesCount);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Post Deleted");
  
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-4xl mx-auto">
  
        {/* Post Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
  
          <h1 className="text-5xl font-bold text-[#401E12] mb-4">
            {post.title}
          </h1>
  
          <div className="flex items-center gap-3 mb-6">
  
            <img
              src={`https://ui-avatars.com/api/?name=${post.author?.name}&background=401E12&color=fff`}
              alt={post.author?.name}
              className="w-10 h-10 rounded-full"
            />
  
            <div>
              <p className="text-gray-500 text-sm">
                Written by
              </p>
  
              <Link
                to={`/profile/${post.author?._id}`}
                className="font-semibold text-[#5A2B1B] hover:text-[#FFA500]"
              >
                {post.author?.name}
              </Link>
            </div>
          </div>
  
          <hr className="mb-8" />
  
          <div className="text-gray-800 leading-8 text-lg whitespace-pre-wrap">
            {post.content}
          </div>
  
          <hr className="my-8" />
  
          {/* Likes */}
          <div className="flex items-center gap-4">
  
            <button
              onClick={handleLike}
              className="bg-[#401E12] text-[#FFA500] px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              ❤️ Like
            </button>
  
            <span className="text-gray-600">
              {likes} Likes
            </span>
          </div>
  
          {/* Owner Controls */}
          {isOwner && (
            <div className="flex gap-4 mt-8">
  
              <Link to={`/edit/${id}`}>
                <button className="bg-[#FFA500] text-[#401E12] px-5 py-2 rounded-lg font-semibold hover:opacity-90">
                  Edit Post
                </button>
              </Link>
  
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
  
        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#401E12] mb-6">
            Comments
          </h2>
  
          <CommentSection postId={id} />
        </div>
  
      </div>
    </div>
  );
}