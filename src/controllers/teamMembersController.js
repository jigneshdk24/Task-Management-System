const { TeamMember, User, Task } = require("../models");

// 1. Get all members of a task
exports.getAllMembers = async (req, res) => {
  try {
    const { taskId } = req.params;
    const members = await TeamMember.findAll({
      where: { task_id: taskId, deleted: false },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    res.json({ success: true, members });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. Get a specific member of a task
exports.getMemberById = async (req, res) => {
  try {
    const { taskId, memberId } = req.params;
    const member = await TeamMember.findOne({
      where: { id: memberId, task_id: taskId, deleted: false },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Update member status or role
exports.updateMember = async (req, res) => {
  try {
    const { taskId, memberId } = req.params;
    const { status, updated_by } = req.body;
    const member = await TeamMember.findOne({
      where: { id: memberId, task_id: taskId, deleted: false },
    });
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });

    if (status !== undefined) member.status = status;
    if (updated_by !== undefined) member.updated_by = updated_by;
    member.updated_at = new Date();

    await member.save();
    res.json({ success: true, message: "Member updated", member });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. Remove member (soft delete)
exports.removeMember = async (req, res) => {
  try {
    const { taskId, memberId } = req.params;
    const member = await TeamMember.findOne({
      where: { id: memberId, task_id: taskId, deleted: false },
    });
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });

    member.deleted = true;
    member.updated_at = new Date();
    member.updated_by = req.user.id;
    await member.save();

    res.json({ success: true, message: "Member removed (soft deleted)" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
