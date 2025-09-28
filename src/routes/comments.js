const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createComment } = require("../controllers/commentsController");
const commentRbac = require("../middleware/commentRbac");

router.post("/comments", authMiddleware, commentRbac, createComment);

module.exports = router;

