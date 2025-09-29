const express = require("express");
const router = express.Router();

const {
  createStatus,
  updateStatus,
  deleteStatus,
  getAllStatus,
  getStatusById,
} = require("../controllers/statusMasterController.js");

router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);
router.get("/", getAllStatus);
router.get("/:id", getStatusById);

module.exports = router;
