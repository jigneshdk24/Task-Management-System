const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeamMember = sequelize.define(
  "TeamMember",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "tasks", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,

      allowNull: false,
      references: { model: "users", key: "id" },
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    created_by: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "team_members",
    timestamps: false,
  }
);

module.exports = TeamMember;
