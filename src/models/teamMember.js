const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TeamMember = sequelize.define(
  "TeamMember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Foreign key to Task.id (association can be defined separately)
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "team_members",
    timestamps: false,
  }
);

module.exports = TeamMember;
