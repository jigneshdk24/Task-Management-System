const { Task, TeamMember } = require("../models");

const taskRbac = async (req, res, next) => {
  const userId = req.user.id;
  const isAdmin = req.user.is_admin;
  const taskId = req.params.id;

  try {
    // Fetch task and assigned users
    const task = await Task.findByPk(taskId, {
      include: [{ model: TeamMember, attributes: ["user_id"] }],
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check admin
    if (isAdmin === 1) return next();

    // Check creator
    if (task.created_by === userId) return next();

    // Check assignees
    const assignedUserIds = task.TeamMembers.map((tm) => tm.user_id);
    if (assignedUserIds.includes(userId)) return next();

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = taskRbac;
