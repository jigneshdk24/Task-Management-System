const { Task } = require("../models");

const assignRbac = async (req, res, next) => {
  const userId = req.user.id;
  const isAdmin = req.user.is_admin;
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (isAdmin === 1 || task.created_by === userId) return next();

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = assignRbac;
