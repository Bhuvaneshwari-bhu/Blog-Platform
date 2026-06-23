import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout, user } = useAuth();

  return (
    <nav className="bg-[#401E12] shadow-md border-b border-[#5A2B1B]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#FFA500] hover:opacity-90 transition"
        >
          BlogSphere
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-white font-medium">

          <Link
            to="/"
            className="hover:text-[#FFA500] transition"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/create"
                className="hover:text-[#FFA500] transition"
              >
                Create Post
              </Link>

              <Link
                to="/my-posts"
                className="hover:text-[#FFA500] transition"
              >
                My Blogs
              </Link>

              <Link
                to={`/profile/${user?.id}`}
                className="hover:text-[#FFA500] transition"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="bg-[#FFA500] text-[#401E12] font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-[#FFA500] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#FFA500] text-[#401E12] font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}