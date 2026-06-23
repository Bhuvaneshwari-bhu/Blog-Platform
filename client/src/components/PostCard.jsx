import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h2>{post.title}</h2>

      <p>
        By: {post.author?.name}
      </p>

      <p>
        {post.content.slice(0, 100)}...
      </p>

      <Link to={`/post/${post._id}`}>
        Read More
      </Link>
    </div>
  );
}