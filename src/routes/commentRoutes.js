const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  listTaskComments,
} = require("../controllers/commentsController");
const commentRbac = require("../middleware/commentRbac");
const commentModifyRbac = require("../middleware/commentModifyRbac");
const taskCommentsRbac = require("../middleware/taskCommentsRbac");
const prepareTaskComment = require("../middleware/prepareTaskComment");

// Admin-only list all comments
router.get("/comments", authMiddleware, (req, res, next) => {
  return req.user.is_admin === 1
    ? next()
    : res.status(403).json({ message: "Forbidden" });
});

// Create comment (body: task_id, user_id, comment, status_id)
router.post("/comments", authMiddleware, commentRbac, createComment);

// Task-scoped create shortcut
router.post(
  "/tasks/:taskId/comments",
  authMiddleware,
  prepareTaskComment,
  commentRbac,
  createComment
);
router.get("/comments/:id", authMiddleware, commentModifyRbac, getCommentById);
router.get(
  "/tasks/:taskId/comments",
  authMiddleware,
  taskCommentsRbac,
  listTaskComments
);
router.patch("/comments/:id", authMiddleware, commentModifyRbac, updateComment);
router.delete(
  "/comments/:id",
  authMiddleware,
  commentModifyRbac,
  deleteComment
);

module.exports = router;
