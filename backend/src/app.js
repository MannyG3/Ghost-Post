require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");

const app = express();
let connectionPromise;

app.use(express.json());

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is missing.");
    }

    const { MongoMemoryServer } = require("mongodb-memory-server");
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    process.env.MONGODB_URI = mongoUri;
  }

  connectionPromise = mongoose.connect(mongoUri);
  await connectionPromise;
}

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

app.use(async (req, _res, next) => {
  if (req.path === "/" || req.path === "/health") {
    return next();
  }

  try {
    await connectDatabase();
    return next();
  } catch (error) {
    return next(error);
  }
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
  await connectDatabase();
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