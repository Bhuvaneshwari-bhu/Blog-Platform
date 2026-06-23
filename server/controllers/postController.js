import Post from "../models/Post.js";


// CREATE POST
export const createPost = async(req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.create({
            title,
            content,
            author: req.user.id,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getMyPosts = async(req, res) => {
    try {
        const posts = await Post.find({
            author: req.user.id,
        }).populate("author", "name email");

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};


// GET ALL POSTS
export const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .populate("likes", "name")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// GET SINGLE POST
export const getPostById = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// UPDATE POST
export const updatePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                msg: "Not authorized",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// DELETE POST
export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                msg: "Not authorized",
            });
        }

        await post.deleteOne();

        res.json({
            msg: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const toggleLike = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                msg: "Post not found",
            });
        }

        const userId = req.user.id;

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            likesCount: post.likes.length,
            liked: !alreadyLiked,
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};