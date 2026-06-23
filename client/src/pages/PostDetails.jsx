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
    <div>
      <h1>{post.title}</h1>

      <p>
        By: {post.author?.name}
      </p>

      <hr />

      <p>{post.content}</p>
      <button onClick={handleLike}>
  ❤️ Like
</button>

<p>
  Total Likes: {likes}
</p>

{isOwner && (
  <>
    <br />

    <Link to={`/edit/${id}`}>
      <button>Edit Post</button>
    </Link>

    <button onClick={handleDelete}>
      Delete Post
    </button>
  </>
)}

<hr />

    <CommentSection postId={id} />
    </div>
    
  );
}