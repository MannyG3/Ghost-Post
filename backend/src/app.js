require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Ghost-Post API is running.",
    health: "/health",
    auth: "/api/auth",
    content: "/api/generate-content",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "ghost-post-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api", contentRoutes);

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Unexpected server error.",
  });
});

async function start() {
  const port = process.env.PORT || 4000;
  let mongoUri = process.env.MONGODB_URI;
  let memoryServer;

  if (!mongoUri && process.env.NODE_ENV !== "production") {
    memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
  }

  if (!mongoUri) throw new Error("MONGODB_URI is missing.");

  await mongoose.connect(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Ghost-Post API running on port ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}

module.exports = app;