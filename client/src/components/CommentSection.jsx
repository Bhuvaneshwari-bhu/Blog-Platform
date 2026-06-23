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
      console.log(error.response?.data);
      console.log(error);
    }
  };

  return (
    <div>
      

      {comments.map((comment) => (
  <div
    key={comment._id}
    className="bg-[#FFF8F3] border border-gray-200 rounded-xl p-4 mb-4"
  >
    <p className="font-semibold text-[#401E12]">
      {comment.author?.name}
    </p>

    <p className="text-gray-700 mt-2">
      {comment.text}
    </p>
  </div>
))}
<textarea
  className="w-full h-32 border-2 border-red-500 bg-white p-3 rounded-lg"
  placeholder="Write a comment..."
  value={text}
  onChange={(e) => setText(e.target.value)}
/>

      <br />

      <button
  onClick={addComment}
  className="mt-4 bg-[#401E12] text-[#FFA500] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200 shadow-md"
>
  Add Comment
</button>
    </div>
  );
}