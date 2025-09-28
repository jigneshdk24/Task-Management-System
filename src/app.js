const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const sequelize = require("./config/database");
const { User, Task, StatusMaster, TeamMember } = require("./models/index");

const userRoutes = require("./routes/users");
const statusMasterRoutes = require("./routes/statusMaster");
const taskRoutes = require("./routes/taskRoutes");
const teamMemberRoutes = require("./routes/TeamMemberRoutes");
const commentRoutes = require("./routes/comments");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/status", authMiddleware, statusMasterRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/", commentRoutes);
app.use("/", teamMemberRoutes);

// Sync DB
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Sync error:", err);
  });

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
