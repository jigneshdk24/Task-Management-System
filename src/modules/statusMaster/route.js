const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const {
  createStatus,
  updateStatus,
  deleteStatus,
  getAllStatus,
  getStatusById,
} = require("./controller");

router.post("/", auth, createStatus);
router.put(":/id", auth, updateStatus);
router.delete(":/id", auth, deleteStatus);
router.get("/", auth, getAllStatus);
router.get(":/id", auth, getStatusById);

module.exports = router;

