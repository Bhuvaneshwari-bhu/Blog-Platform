import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPost from "./pages/EditPost";
import MyPosts from "./pages/MyPosts";
function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
  path="/create"
  element={
    <ProtectedRoute>
      <CreatePost />
    </ProtectedRoute>
  }

/>
<Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditPost />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-posts"
  element={
    <ProtectedRoute>
      <MyPosts />
    </ProtectedRoute>
  }
/>
        <Route path="/post/:id" element={<PostDetails />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;