import express from "express";

import {
    createPost,
    getMyPosts,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get(
    "/my-posts",
    protect,
    getMyPosts
);

router.get("/:id", getPostById);

router.post("/", protect, createPost);

router.put("/:id", protect, updatePost);

router.delete("/:id", protect, deletePost);

router.post("/:id/like", protect, toggleLike);

export default router;