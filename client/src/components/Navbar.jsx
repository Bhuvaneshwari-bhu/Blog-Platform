import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "10px",
        borderBottom: "1px solid gray",
      }}
    >
      <Link to="/">Home</Link>

      {token ? (
        <>
          <Link to="/create">Create Post</Link>
          <Link to="/my-posts">
  My Blogs
</Link>
          <button onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>

          <Link to="/register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}