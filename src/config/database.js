const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DATABASE_NAME;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const SQLITE_FILE = process.env.SQLITE_FILE;

let sequelize;

if (SQLITE_FILE) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: SQLITE_FILE,
    logging: false,
  });
  console.log(`Using SQLite database at ${SQLITE_FILE}`);
} else {
  sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: HOST,
    dialect: "mysql",
    logging: false,
  });
  console.log(`Using MySQL database ${DB_NAME} at ${HOST} as ${USER_NAME}`);
}

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
