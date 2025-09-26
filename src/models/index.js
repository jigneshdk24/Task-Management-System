const User = require("./user");
const Task = require("./task");
const StatusMaster = require("./statusMaster");
const TeamMember = require("./teamMember");
// 1. User has many Tasks
// 1. User has many Tasks
User.hasMany(Task, { foreignKey: "created_by" });
Task.belongsTo(User, { foreignKey: "created_by" });

// 2. StatusMaster has many Tasks (status relationship)
// Using status_id instead of status_code is recommended
StatusMaster.hasMany(Task, { foreignKey: "status_code", sourceKey: "id" });
Task.belongsTo(StatusMaster, { foreignKey: "status_code", targetKey: "id" });

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

module.exports = { User, Task, StatusMaster, TeamMember };
