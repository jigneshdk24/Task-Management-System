const { Task, TeamMember, User, StatusMaster } = require("../models");

// Create Task (any authenticated user)
const createTask = async (req, res) => {
  const { name, desc, status_code, due_date } = req.body;

  try {
    // 1. Check if a task with the same name already exists
    const existingTask = await Task.findOne({ where: { name } });
    if (existingTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task name already exists" });
    }

    const statusExists = await StatusMaster.findOne({
      where: { code: status_code },
    });
    if (!statusExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status code" });
    }
    // 2. Create the task
    const task = await Task.create({
      name,
      desc,
      status_code,
      due_date,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Task created", data: task });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ success: false, message: "Task name already exists" });
    }
    res.status(500).json({ success: false, message: "Error creating task" });
  }
};

// Helper: RBAC check for admin, creator, or assignee
async function canAccessTask(user, taskId) {
  const task = await Task.findByPk(taskId, {
    include: [{ model: TeamMember, attributes: ["user_id"] }],
  });
  if (!task) return false;
  if (user.is_admin === 1) return true;
  if (task.created_by === user.id) return true;
  const assignedUserIds = task.TeamMembers.map((tm) => tm.user_id);
  if (assignedUserIds.includes(user.id)) return true;
  return false;
}

// Get Task by ID (RBAC)
const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  if (!(await canAccessTask(req.user, taskId))) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const task = await Task.findByPk(taskId, {
    include: [{ model: TeamMember }],
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

// Update Task (RBAC)
const updateTask = async (req, res) => {
  const taskId = req.params.id;
  if (!(await canAccessTask(req.user, taskId))) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const task = await Task.findByPk(taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });
  await task.update(req.body);
  res.json(task);
};

// Delete Task (RBAC)
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  if (!(await canAccessTask(req.user, taskId))) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const task = await Task.findByPk(taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });
  await task.destroy();
  res.json({ message: "Task deleted" });
};

// Get All Tasks (admin only, or filter by user involvement)
const getAllTask = async (req, res) => {
  let tasks;
  if (req.user.is_admin === 1) {
    tasks = await Task.findAll({ include: [{ model: TeamMember }] });
  } else {
    // Show tasks where user is creator or assignee
    tasks = await Task.findAll({
      include: [
        { model: TeamMember, where: { user_id: req.user.id }, required: false },
      ],
      where: {
        [require("sequelize").Op.or]: [
          { created_by: req.user.id },
          require("sequelize").literal(
            `"TeamMembers"."user_id" = ${req.user.id}`
          ),
        ],
      },
    });
  }
  res.json(tasks);
};
console.log("here");
// Assign users to a task (admin or creator only)
const assignUsers = async (req, res) => {
  const taskId = req.params.id;
  const { userIds } = req.body;

  try {
    console.log("Incoming userIds:", userIds);
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!(req.user.is_admin === 1 || task.created_by === req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // await TeamMember.destroy({ where: { task_id: taskId } });

    await Promise.all(
      userIds.map((uid) => TeamMember.create({ task_id: taskId, user_id: uid }))
    );

    res.json({ message: "Assignees updated" });
  } catch (error) {
    console.error("Assign Users Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTask,
  getTaskById,
  assignUsers,
};
