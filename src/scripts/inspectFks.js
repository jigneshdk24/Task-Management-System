const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

(async () => {
	try {
		await sequelize.authenticate();
		const [rows] = await sequelize.query(
			`SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
			 FROM information_schema.KEY_COLUMN_USAGE
			 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('team_members','tasks')
			 ORDER BY TABLE_NAME, CONSTRAINT_NAME;`
		);
		console.table(rows);
		process.exit(0);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();

