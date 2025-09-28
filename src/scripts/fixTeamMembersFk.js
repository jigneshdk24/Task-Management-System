const sequelize = require("../config/database");

async function dropWrongFks() {
	const [rows] = await sequelize.query(
		`SELECT CONSTRAINT_NAME
		 FROM information_schema.REFERENTIAL_CONSTRAINTS
		 WHERE CONSTRAINT_SCHEMA = DATABASE()
		 AND TABLE_NAME = 'team_members'
		 AND REFERENCED_TABLE_NAME = 'team_members';`
	);
	for (const r of rows) {
		console.log("Dropping wrong FK:", r.CONSTRAINT_NAME);
		await sequelize.query(
			`ALTER TABLE team_members DROP FOREIGN KEY \`${r.CONSTRAINT_NAME}\``
		);
	}
}

async function ensureCorrectFk() {
	await sequelize.query(
		`ALTER TABLE team_members MODIFY COLUMN task_id INT NOT NULL`
	);
	await sequelize.query(
		`ALTER TABLE team_members
		 ADD CONSTRAINT fk_team_members_task
		 FOREIGN KEY (task_id) REFERENCES tasks(id)
		 ON DELETE CASCADE ON UPDATE CASCADE`
	);
}

(async () => {
	try {
		await sequelize.authenticate();
		await dropWrongFks();
		await ensureCorrectFk();
		console.log("FK fixed.");
		process.exit(0);
	} catch (e) {
		console.error("Fix failed:", e);
		process.exit(1);
	}
})();

