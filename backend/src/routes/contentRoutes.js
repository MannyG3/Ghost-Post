const express = require("express");
const { generateContent } = require("../controllers/contentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-content", requireAuth, generateContent);

module.exports = router;