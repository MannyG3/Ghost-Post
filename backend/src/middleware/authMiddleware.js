const User = require("../models/User");
const { verifyToken } = require("../services/authService");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7).trim();
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "Missing bearer token." });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select("_id email role name timezone");

    if (!user) {
      return res.status(401).json({ error: "Invalid auth token." });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      timezone: user.timezone,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Unauthorized." });
  }
}

module.exports = {
  requireAuth,
};