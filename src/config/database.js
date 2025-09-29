const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DATABASE_NAME;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;

const sequelize = new Sequelize(
  DB_NAME, // Database name
  USER_NAME, // DB username
  PASSWORD, // DB password
  {
    host: HOST,
    dialect: "mysql",
    logging: false, // Set to true if you want to see raw SQL logs
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize ;
