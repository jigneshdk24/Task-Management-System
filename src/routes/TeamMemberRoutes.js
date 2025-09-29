const express = require("express");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const teamMembersController = require("../controllers/teamMembersController");

router.get(
  "/tasks/:taskId/members",
  authMiddleware,
  teamMembersController.getAllMembers
);
router.get(
  "/tasks/:taskId/members/:memberId",
  authMiddleware,
  teamMembersController.getMemberById
);
router.patch(
  "/tasks/:taskId/members/:memberId",
  authMiddleware,
  teamMembersController.updateMember
);
router.delete(
  "/tasks/:taskId/members/:memberId",
  authMiddleware,
  teamMembersController.removeMember
);

module.exports = router;
