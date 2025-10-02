const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../../middleware/authMiddleware");
const controller = require("./controller");

router.get("/tasks/:taskId/members", auth, controller.getAllMembers);
router.get("/tasks/:taskId/members/:memberId", auth, controller.getMemberById);
router.patch("/tasks/:taskId/members/:memberId", auth, controller.updateMember);
router.delete("/tasks/:taskId/members/:memberId", auth, controller.removeMember);

module.exports = router;

