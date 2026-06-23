import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const profileId = id || user?.id;
  const isOwner = user?.id === profileId;

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    bio: "",
    interests: "",
    profilePic: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);

      setFormData({
        bio: res.data.bio || "",
        interests: res.data.interests || "",
        profilePic: res.data.profilePic || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(
        `/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile({
        ...profile,
        ...res.data,
      });

      alert("Profile Updated");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  if (!profile) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3] py-10 px-4">
      <div className="max-w-4xl mx-auto">
  
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
  
          <div className="flex flex-col md:flex-row items-center gap-6">
  
            <img
              src={
                profile.profilePic ||
                `https://ui-avatars.com/api/?name=${profile.name}&background=401E12&color=fff`
              }
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-[#FFA500] object-cover"
            />
  
            <div>
              <h1 className="text-4xl font-bold text-[#401E12]">
                {profile.name}
              </h1>
  
              <p className="text-gray-600 mt-2">
                {profile.email}
              </p>
  
              <div className="mt-4 inline-block bg-[#401E12] text-[#FFA500] px-4 py-2 rounded-lg font-semibold">
                {profile.totalPosts} Posts Published
              </div>
            </div>
          </div>
        </div>
  
        {/* About */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#401E12] mb-4">
            About
          </h2>
  
          <p className="text-gray-700 leading-relaxed">
            {profile.bio || "No bio added yet."}
          </p>
        </div>
  
        {/* Interests */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#401E12] mb-4">
            Interests
          </h2>
  
          <div className="flex flex-wrap gap-3">
            {profile.interests ? (
              profile.interests
                .split(",")
                .map((interest, index) => (
                  <span
                    key={index}
                    className="bg-[#401E12] text-[#FFA500] px-4 py-2 rounded-full"
                  >
                    {interest.trim()}
                  </span>
                ))
            ) : (
              <p className="text-gray-500">
                No interests added yet.
              </p>
            )}
          </div>
        </div>
  
        {/* Edit Section */}
        {isOwner && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#401E12] mb-6">
              Edit Profile
            </h2>
  
            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >
              <div>
                <label className="block mb-2 font-medium text-[#401E12]">
                  Bio
                </label>
  
                <textarea
                  rows="5"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
              </div>
  
              <div>
                <label className="block mb-2 font-medium text-[#401E12]">
                  Interests
                </label>
  
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="React, AI, Web Development"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
              </div>
  
              <div>
                <label className="block mb-2 font-medium text-[#401E12]">
                  Profile Picture URL
                </label>
  
                <input
                  type="text"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
              </div>
  
              <button
                type="submit"
                className="bg-[#401E12] text-[#FFA500] px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}