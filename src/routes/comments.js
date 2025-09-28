const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createComment } = require("../controllers/commentsController");

router.post("/comments", authMiddleware, createComment);

module.exports = router;

