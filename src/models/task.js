const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
	"Task",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status_code: {
			type: DataTypes.STRING(50),
			allowNull: false,
			references: { model: "status_master", key: "code" },
		},
		due_date: {
			type: DataTypes.DATE,
			allowNull: true,
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
	},
	{
		tableName: "tasks",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

module.exports = Task;
