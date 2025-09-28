const { Comment, Task, TeamMember, User } = require("../models");

exports.createComment = async (req, res) => {
	try {
		const { task_id, user_id, comment, status_id } = req.body;
		const created = await Comment.create({ task_id, user_id, comment, status_id });
		return res.status(201).json({ success: true, data: created });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error creating comment" });
	}
};

exports.getCommentById = async (req, res) => {
	try {
		const { id } = req.params;
		const comment = await Comment.findByPk(id, {
			include: [
				{ model: User, attributes: ["id", "name", "email"] },
				{ model: Task, attributes: ["id", "name", "created_by"] },
			],
		});
		if (!comment) return res.status(404).json({ message: "Comment not found" });
		return res.json({ success: true, data: comment });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error fetching comment" });
	}
};

exports.listTaskComments = async (req, res) => {
	try {
		const { taskId } = req.params;
		const page = parseInt(req.query.page || "1", 10);
		const limit = parseInt(req.query.limit || "20", 10);
		const offset = (page - 1) * limit;
		const order = req.query.order === "asc" ? "ASC" : "DESC";

		const { rows, count } = await Comment.findAndCountAll({
			where: { task_id: taskId },
			include: [{ model: User, attributes: ["id", "name", "email"] }],
			order: [["created_at", order]],
			limit,
			offset,
		});
		return res.json({ success: true, data: rows, meta: { page, limit, count } });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error listing comments" });
	}
};

exports.listAllComments = async (req, res) => {
	try {
		const page = parseInt(req.query.page || "1", 10);
		const limit = parseInt(req.query.limit || "50", 10);
		const offset = (page - 1) * limit;
		const order = req.query.order === "asc" ? "ASC" : "DESC";
		const where = {};
		if (req.query.task_id) where.task_id = req.query.task_id;
		if (req.query.user_id) where.user_id = req.query.user_id;
		if (req.query.status_id) where.status_id = req.query.status_id;

		const { rows, count } = await Comment.findAndCountAll({
			where,
			include: [
				{ model: User, attributes: ["id", "name", "email"] },
				{ model: Task, attributes: ["id", "name", "created_by"] },
			],
			order: [["created_at", order]],
			limit,
			offset,
		});
		return res.json({ success: true, data: rows, meta: { page, limit, count } });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error listing comments" });
	}
};
exports.updateComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment, status_id } = req.body;
		const existing = await Comment.findByPk(id);
		if (!existing) return res.status(404).json({ message: "Comment not found" });
		if (comment !== undefined) existing.comment = comment;
		if (status_id !== undefined) existing.status_id = status_id;
		existing.updated_at = new Date();
		await existing.save();
		return res.json({ success: true, data: existing });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error updating comment" });
	}
};

exports.deleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		const existing = await Comment.findByPk(id);
		if (!existing) return res.status(404).json({ message: "Comment not found" });
		await existing.destroy();
		return res.json({ success: true, message: "Comment deleted" });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error deleting comment" });
	}
};

