const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createComment, updateComment, deleteComment, getCommentById, listTaskComments } = require("../controllers/commentsController");
const commentRbac = require("../middleware/commentRbac");
const commentModifyRbac = require("../middleware/commentModifyRbac");
const taskCommentsRbac = require("../middleware/taskCommentsRbac");

router.post("/comments", authMiddleware, commentRbac, createComment);
router.get("/comments/:id", authMiddleware, commentModifyRbac, getCommentById);
router.get("/tasks/:taskId/comments", authMiddleware, taskCommentsRbac, listTaskComments);
router.patch("/comments/:id", authMiddleware, commentModifyRbac, updateComment);
router.delete("/comments/:id", authMiddleware, commentModifyRbac, deleteComment);

module.exports = router;

