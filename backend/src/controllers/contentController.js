const { generateContentCalendar } = require("../services/contentGenerationService");

async function generateContent(req, res, next) {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({ error: "githubUrl is required." });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const userId = req.user.id;

    const result = await generateContentCalendar({
      userId,
      githubUrl,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateContent,
};