
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
	"Comment",
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
		comment: { type: DataTypes.TEXT, allowNull: false },
		status_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "status_master", key: "id" },
		},
		created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
	},
	{
		tableName: "comments",
		timestamps: false,
	}
);

module.exports = Comment;