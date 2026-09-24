const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ZodError } = require("zod");
const chatRoutes = require("./routes/chatRoutes");
const { AppError } = require("./utils/errors");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/chat", chatRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

module.exports = app;
