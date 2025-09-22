const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const sequelize = require("./config/database");
const { User, Task, StatusMaster, TeamMember } = require("./models/index");

const userRoutes = require("./routes/users");
const statusMasterRoutes = require("./middleware/statusMaster");
const taskRoutes = require("./routes/taskRoutes");
const { authMiddleware } = require("./middleware/authMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/status", authMiddleware, statusMasterRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
// Sync DB
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync error:", err);
  });

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
