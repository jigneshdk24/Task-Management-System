const express = require("express");
const cors = require("cors");

// Central routes registry
const routes = require("../routes");

const app = express();

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check
app.get("/health", (req, res) => {
  return res.status(200).json({ success: true, message: "OK" });
});

// Register all module routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  return res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

module.exports = app;

