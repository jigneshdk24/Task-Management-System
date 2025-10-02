const { Comment } = require("../models");

exports.createComment = async (req, res) => {
  try {
    const { task_id, user_id, comment, status_id } = req.body;
    const created = await Comment.create({
      task_id,
      user_id,
      comment,
      status_id,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error creating comment" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, status_id } = req.body;
    const existing = await Comment.findByPk(id);
    if (!existing)
      return res.status(404).json({ message: "Comment not found" });
    if (comment !== undefined) existing.comment = comment;
    if (status_id !== undefined) existing.status_id = status_id;
    existing.updated_at = new Date();
    await existing.save();
    return res.json({ success: true, data: existing });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Comment.findByPk(id);
    if (!existing)
      return res.status(404).json({ message: "Comment not found" });
    await existing.destroy();
    return res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting comment" });
  }
};
