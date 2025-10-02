const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const StatusMaster = require("./statusMaster");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: StatusMaster,
        key: "code",
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    due_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "tasks",
    timestamps: false,
  }
);

module.exports = Task;
