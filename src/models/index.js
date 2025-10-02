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
// Using status_id instead of status_code is recommended
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

Task.hasMany(TeamMember, { foreignKey: "task_id" });
TeamMember.belongsTo(Task, { foreignKey: "task_id" });
User.hasMany(TeamMember, { foreignKey: "user_id" });
TeamMember.belongsTo(User, { foreignKey: "user_id" });

Task.hasMany(Comment, { foreignKey: "task_id" });
Comment.belongsTo(Task, { foreignKey: "task_id" });
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });
StatusMaster.hasMany(Comment, { foreignKey: "status_id", sourceKey: "code" });
Comment.belongsTo(StatusMaster, { foreignKey: "status_id", targetKey: "code" });

module.exports = { User, Task, StatusMaster, TeamMember, Comment };
