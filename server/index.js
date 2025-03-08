const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

// Connect to database
connectDb();

const app = express();

// Middleware
app
  .use(cors())
  .use(express.json())
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(morgan(":method :url :status :res[content-length] - :response-time ms"));

const PORT = process.env.PORT || 4000;

// Routes
app.use("/api/users", require("./routers/userRoutes"));
app.use("/api/jobs", require("./routers/jobListingRoutes"));
app.use("/api/messages", require("./routers/messageRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error: err.message,
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
