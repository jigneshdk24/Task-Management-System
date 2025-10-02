const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createStatus,
  updateStatus,
  deleteStatus,
  getAllStatus,
  getStatusById,
} = require("../controllers/statusMasterController");

router.post("/", authMiddleware, createStatus);
router.put("/:id", authMiddleware, updateStatus);
router.delete("/:id", authMiddleware, deleteStatus);
router.get("/", authMiddleware, getAllStatus);
router.get("/:id", authMiddleware, getStatusById);

module.exports = router;

