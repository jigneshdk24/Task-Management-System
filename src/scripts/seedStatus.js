const sequelize = require("../config/database");
const { StatusMaster } = require("../models");
const { defaultStatuses } = require("../utils/util");

(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connected to DB. Seeding statuses if missing...");

		for (const s of defaultStatuses()) {
			const [record, created] = await StatusMaster.findOrCreate({
				where: { code: s.code },
				defaults: { name: s.name, code: s.code },
			});
			console.log(`${created ? "Created" : "Exists"}: ${record.code}`);
		}

		process.exit(0);
	} catch (err) {
		console.error("Seed failed", err);
		process.exit(1);
	}
})();

