import Comment from "../models/Comment.js";
import Post from "../models/Post.js";


// Add Comment
export const addComment = async(req, res) => {
    try {
        const { text } = req.body;

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                msg: "Post not found",
            });
        }

        const comment = await Comment.create({
            text,
            author: req.user.id,
            post: req.params.postId,
        });

        res.status(201).json(comment);

    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};


// Get Comments For A Post
export const getCommentsByPost = async(req, res) => {
    try {

        const comments = await Comment.find({
                post: req.params.postId,
            })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(comments);

    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};


// Delete Comment
export const deleteComment = async(req, res) => {
    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                msg: "Comment not found",
            });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                msg: "Not authorized",
            });
        }

        await comment.deleteOne();

        res.json({
            msg: "Comment deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
};