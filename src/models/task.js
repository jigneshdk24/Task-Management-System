const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Define Task model (tasks table)
const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    desc: { type: DataTypes.TEXT, allowNull: true },
    status_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "status_master", key: "id" },
    },
    due_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    updated_by: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "tasks",
    timestamps: false,
  }
);

module.exports = Task;
