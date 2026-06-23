import express from "express";

import {
    addComment,
    getCommentsByPost,
    deleteComment,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/post/:postId", protect, addComment);

router.get("/post/:postId", getCommentsByPost);

router.delete("/:commentId", protect, deleteComment);

export default router;