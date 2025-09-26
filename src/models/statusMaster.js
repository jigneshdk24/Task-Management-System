const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StatusMaster = sequelize.define(
  "StatusMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // primaryKey: true,
      unique: true,
      defaultValue: "TO_DO",
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "to_do",
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    deleted: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
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
      references: { model: "users", key: "id" },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "status_master",
    timestamps: false,
  }
);

module.exports = StatusMaster;
