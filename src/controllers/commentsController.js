const { Comment } = require("../models");

exports.createComment = async (req, res) => {
	try {
		const { task_id, user_id, comment, status_id } = req.body;
		const created = await Comment.create({ task_id, user_id, comment, status_id });
		return res.status(201).json({ success: true, data: created });
	} catch (err) {
		return res.status(500).json({ success: false, message: "Error creating comment" });
	}
};

