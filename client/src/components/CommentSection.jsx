import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({ postId }) {
  const { token } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const res = await api.get(
      `/comments/post/${postId}`
    );

    setComments(res.data);
  };

  const addComment = async () => {
    try {
      await api.post(
        `/comments/post/${postId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");

      fetchComments();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>

      {comments.map((comment) => (
        <div key={comment._id}>
          <strong>
            {comment.author?.name}
          </strong>

          <p>{comment.text}</p>

          <hr />
        </div>
      ))}

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
      />

      <br />

      <button onClick={addComment}>
        Add Comment
      </button>
    </div>
  );
}