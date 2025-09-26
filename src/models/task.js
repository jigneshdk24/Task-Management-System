const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeamMember = sequelize.define(
  "TeamMember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true, // system-generated rows can have null
      references: { model: "users", key: "id" },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "team_members",
    timestamps: true, // Sequelize manages created_at and updated_at
    createdAt: "created_at", // maps createdAt to snake_case
    updatedAt: "updated_at", // maps updatedAt to snake_case
  }
);

module.exports = TeamMember;
