const { Task, TeamMember } = require("../models");

module.exports = async (req, res, next) => {
	try {
		const { task_id, user_id } = req.body;
		if (!task_id || !user_id) {
			return res.status(400).json({ message: "task_id and user_id are required" });
		}

		// Non-admin users can only comment as themselves
		if (req.user.is_admin !== 1 && req.user.id !== user_id) {
			return res.status(403).json({ message: "Forbidden" });
		}

		const task = await Task.findByPk(task_id, {
			include: [{ model: TeamMember, attributes: ["user_id"] }],
		});
		if (!task) return res.status(404).json({ message: "Task not found" });

		if (req.user.is_admin === 1) return next();
		if (task.created_by === req.user.id) return next();
		const assignedUserIds = (task.TeamMembers || []).map((tm) => tm.user_id);
		if (assignedUserIds.includes(req.user.id)) return next();

		return res.status(403).json({ message: "Forbidden" });
	} catch (e) {
		return res.status(500).json({ message: "Server error" });
	}
};

