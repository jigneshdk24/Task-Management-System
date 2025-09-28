const { Comment, Task, TeamMember } = require("../models");

module.exports = async (req, res, next) => {
	try {
		const { id } = req.params; // comment id
		const comment = await Comment.findByPk(id);
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		// Load task and team membership
		const task = await Task.findByPk(comment.task_id, {
			include: [{ model: TeamMember, attributes: ["user_id"] }],
		});
		if (!task) return res.status(404).json({ message: "Task not found" });

		// Permissions: admin OR task creator OR assignee
		if (req.user.is_admin === 1) return next();
		if (task.created_by === req.user.id) return next();
		const assignedUserIds = (task.TeamMembers || []).map((tm) => tm.user_id);
		if (assignedUserIds.includes(req.user.id)) return next();

		return res.status(403).json({ message: "Forbidden" });
	} catch (e) {
		return res.status(500).json({ message: "Server error" });
	}
};

