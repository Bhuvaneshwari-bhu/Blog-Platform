import User from "../models/User.js";
import Post from "../models/Post.js";

export const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        const totalPosts = await Post.countDocuments({
            author: req.user.id,
        });

        res.json({
            ...user._doc,
            totalPosts,
        });
    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};

export const updateProfile = async(req, res) => {
    try {
        const { bio, interests, profilePic } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id, {
                bio,
                interests,
                profilePic,
            }, { new: true }
        ).select("-password");

        res.json(user);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};

export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        const totalPosts = await Post.countDocuments({
            author: req.params.id,
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({
            ...user._doc,
            totalPosts,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};