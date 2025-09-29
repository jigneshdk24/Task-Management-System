module.exports = (req, res, next) => {
  try {
    if (req.params.taskId && !req.body.task_id) {
      req.body.task_id = parseInt(req.params.taskId, 10);
    }
    // Default user_id to token user if not provided (non-admins still validated in commentRbac)
    if (!req.body.user_id && req.user && req.user.id) {
      req.body.user_id = req.user.id;
    }
    return next();
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
};
