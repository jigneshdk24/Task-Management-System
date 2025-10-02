const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/teamMembersController");

router.get("/tasks/:taskId/members", authMiddleware, controller.getAllMembers);
router.get("/tasks/:taskId/members/:memberId", authMiddleware, controller.getMemberById);
router.patch("/tasks/:taskId/members/:memberId", authMiddleware, controller.updateMember);
router.delete("/tasks/:taskId/members/:memberId", authMiddleware, controller.removeMember);

module.exports = router;

