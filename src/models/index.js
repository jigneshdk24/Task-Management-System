const User = require("./user");
const Task = require("./task");
const StatusMaster = require("./statusMaster");
const TeamMember = require("./teamMember");
// 1. User has many Tasks
// 1. User has many Tasks
User.hasMany(Task, { foreignKey: "created_by" });
Task.belongsTo(User, { foreignKey: "created_by" });

// 2. StatusMaster has many Tasks (status relationship)
// Align to status_master.code being the natural key
StatusMaster.hasMany(Task, { foreignKey: "status_code", sourceKey: "code" });
Task.belongsTo(StatusMaster, { foreignKey: "status_code", targetKey: "code" });

// 3. Many-to-many between User and Task via TeamMember (team members)
User.belongsToMany(Task, {
  through: TeamMember,
  foreignKey: "user_id",
  otherKey: "task_id",
});
Task.belongsToMany(User, {
  through: TeamMember,
  foreignKey: "task_id",
  otherKey: "user_id",
});

// 4. Direct associations for convenience (used by includes in controllers)
Task.hasMany(TeamMember, { foreignKey: "task_id" });
TeamMember.belongsTo(Task, { foreignKey: "task_id" });
User.hasMany(TeamMember, { foreignKey: "user_id" });
TeamMember.belongsTo(User, { foreignKey: "user_id" });

module.exports = { User, Task, StatusMaster, TeamMember };
