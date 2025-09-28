const User = require("./user");
const Task = require("./task");
const StatusMaster = require("./statusMaster");
const Comment = require("./comment");
const TeamMember = require("./teamMember");
// 1. User has many Tasks
// 1. User has many Tasks
User.hasMany(Task, { foreignKey: "created_by" });
Task.belongsTo(User, { foreignKey: "created_by" });

// 2. StatusMaster has many Tasks (status relationship)
// Link by `code` to match DB FK on tasks.status_code -> status_master.code
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

module.exports = { User, Task, StatusMaster, TeamMember };
// 4. Comment associations
Task.hasMany(Comment, { foreignKey: "task_id" });
Comment.belongsTo(Task, { foreignKey: "task_id" });
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });
StatusMaster.hasMany(Comment, { foreignKey: "status_id", sourceKey: "id" });
Comment.belongsTo(StatusMaster, { foreignKey: "status_id", targetKey: "id" });

module.exports = { User, Task, StatusMaster, TeamMember, Comment };
