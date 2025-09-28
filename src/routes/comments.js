const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createComment, updateComment, deleteComment } = require("../controllers/commentsController");
const commentRbac = require("../middleware/commentRbac");
const commentModifyRbac = require("../middleware/commentModifyRbac");

router.post("/comments", authMiddleware, commentRbac, createComment);
router.patch("/comments/:id", authMiddleware, commentModifyRbac, updateComment);
router.delete("/comments/:id", authMiddleware, commentModifyRbac, deleteComment);

module.exports = router;

