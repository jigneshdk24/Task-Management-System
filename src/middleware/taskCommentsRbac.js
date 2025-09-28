const { Task, TeamMember } = require("../models");

module.exports = async (req, res, next) => {
	try {
		const taskId = req.params.taskId || req.body.task_id;
		if (!taskId) return res.status(400).json({ message: "taskId is required" });

		const task = await Task.findByPk(taskId, {
			include: [{ model: TeamMember, attributes: ["user_id"] }],
		});
		if (!task) return res.status(404).json({ message: "Task not found" });

		if (req.user.is_admin === 1) return next();
		if (task.created_by === req.user.id) return next();

		return res.status(403).json({ message: "Forbidden" });
	} catch (e) {
		return res.status(500).json({ message: "Server error" });
	}
};

