import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-[#F5F5F5] border border-gray-200 rounded-xl p-6 mb-5 shadow-sm hover:shadow-lg transition duration-300">

      <h2 className="text-2xl font-bold text-[#401E12] mb-3">
        {post.title}
      </h2>

      <p className="text-gray-600 mb-3">
        By{" "}
        <Link
          to={`/profile/${post.author?._id}`}
          className="text-[#5A2B1B] font-semibold hover:text-[#FFA500] transition"
        >
          {post.author?.name}
        </Link>
      </p>

      <p className="text-gray-700 leading-relaxed mb-4">
        {post.content.slice(0, 100)}...
      </p>

      <Link
        to={`/post/${post._id}`}
        className="inline-block bg-[#401E12] text-[#FFA500] px-4 py-2 rounded-lg font-medium hover:scale-105 transition"
      >
        Read More →
      </Link>
    </div>
  );
}