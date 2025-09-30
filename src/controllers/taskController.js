const { Task, TeamMember, User } = require("../models");

// Create Task (any authenticated user)
const createTask = async (req, res) => {
  let { name, desc, status_code, due_date } = req.body;

  // Admin-only guard (accept number/string/boolean)
  const isAdmin = !!(req.user && (req.user.is_admin === 1 || req.user.is_admin === "1" || req.user.is_admin === true));
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can create tasks" });
  }

  try {
    // 1. Check if a task with the same name already exists
    const existingTask = await Task.findOne({ where: { name } });
    if (existingTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task name already exists" });
    }

    // Normalize/validate status_code against status_master.code
    if (!status_code || typeof status_code !== "string") {
      status_code = "TO_DO"; // default to a valid code
    } else {
      status_code = status_code.trim().toUpperCase();
    }
    const { StatusMaster } = require("../models");
    const statusExists = await StatusMaster.findOne({ where: { code: status_code } });
    if (!statusExists) {
      return res.status(400).json({ success: false, message: "Invalid status_code" });
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
  try {
    // If status_code is provided, normalize and validate it
    if (Object.prototype.hasOwnProperty.call(req.body, "status_code")) {
      const { StatusMaster } = require("../models");
      let nextCode = req.body.status_code;
      if (typeof nextCode !== "string") {
        return res.status(400).json({ message: "status_code must be a string" });
      }
      nextCode = nextCode.trim().toUpperCase();
      const statusExists = await StatusMaster.findOne({ where: { code: nextCode } });
      if (!statusExists) {
        return res.status(400).json({ message: "Invalid status_code" });
      }
      req.body.status_code = nextCode;
    }

    // Ensure audit fields reflect the actor performing the update
    req.body.updated_by = req.user.id;
    req.body.updated_at = new Date();

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    return res.status(500).json({ message: "Error updating task" });
  }
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
// Assign users to a task (admin or creator only)
const assignUsers = async (req, res) => {
  const taskId = req.params.id;
  const { userIds } = req.body;

  try {
    console.log("Incoming userIds:", userIds);
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ message: "userIds must be an array" });
    }
    const { Op } = require("sequelize");
    const normalizedUserIds = [...new Set(
      userIds
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    )];
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!(req.user.is_admin === 1 || task.created_by === req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Find existing assignments to avoid duplicates
    const existingAssignments = await TeamMember.findAll({
      where: { task_id: taskId, user_id: { [Op.in]: normalizedUserIds } },
      attributes: ["user_id"],
    });
    const existingUserIdSet = new Set(existingAssignments.map((tm) => tm.user_id));
    const newAssigneeIds = normalizedUserIds.filter((id) => !existingUserIdSet.has(id));

    if (newAssigneeIds.length === 0) {
      return res.json({ message: "No new assignees to add", added: 0, skipped: [...existingUserIdSet] });
    }

    // Validate that new users exist
    const existingUsers = await User.findAll({
      where: { id: { [Op.in]: newAssigneeIds } },
      attributes: ["id"],
    });
    const existingUserIdList = new Set(existingUsers.map((u) => u.id));
    const invalidUserIds = newAssigneeIds.filter((id) => !existingUserIdList.has(id));
    if (invalidUserIds.length > 0) {
      return res.status(400).json({ message: "Some user ids do not exist", invalidUserIds });
    }

    const rowsToCreate = newAssigneeIds.map((uid) => ({
      task_id: Number(taskId),
      user_id: uid,
      created_by: req.user.id,
      updated_by: req.user.id,
    }));
    await TeamMember.bulkCreate(rowsToCreate);

    res.json({ message: "Assignees updated", added: rowsToCreate.length, skipped: [...existingUserIdSet] });
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
