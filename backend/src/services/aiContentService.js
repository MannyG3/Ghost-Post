const OpenAI = require("openai");

let client;

function getClient() {
  if (client) return client;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
}

function createFallbackCalendar(repositoryName, sourceType, sourceText) {
  const lines = sourceText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);

  const highlights = lines.slice(0, 7);
  const posts = [];

  for (let day = 1; day <= 7; day += 1) {
    const focus = highlights[day - 1] || `Progress update for ${repositoryName}`;

    posts.push({
      dayIndex: day,
      platform: "linkedin",
      title: `Day ${day}: Dev-Log from ${repositoryName}`,
      content:
        `Day ${day} update for ${repositoryName}. ` +
        `Today we focused on: ${focus}. ` +
        "We translated implementation details into product-facing value, validated the next milestone, and captured what to ship next.",
      hashtags: ["#BuildInPublic", "#DevLog", "#SaaS", "#Engineering"],
    });

    posts.push({
      dayIndex: day,
      platform: "twitter",
      title: `Day ${day}: ${repositoryName}`,
      content: `Day ${day} on ${repositoryName}: ${focus.slice(0, 170)} #DevLog #BuildInPublic`,
      hashtags: ["#DevLog", "#BuildInPublic"],
    });
  }

  return {
    summary: `Generated from ${sourceType} context for ${repositoryName} using fallback mode.`,
    posts,
  };
}

const SYSTEM_PROMPT = [
  "You are Ghost-Post AI, an expert technical storyteller for social media.",
  "Your job is to convert technical project context into a 7-day Dev-Log content calendar.",
  "Write clear, engaging posts for developers and founders.",
  "Avoid empty hype and avoid copy-paste README language.",
  "Each day should add narrative progression: setup, challenge, breakthrough, value, and next steps.",
  "Output valid JSON only.",
  "Use this schema exactly:",
  "{",
  '  \"summary\": \"string\",',
  '  \"posts\": [',
  "    {",
  '      \"dayIndex\": 1,',
  '      \"platform\": \"linkedin\",',
  '      \"title\": \"string\",',
  '      \"content\": \"string\",',
  '      \"hashtags\": [\"#tag\", \"#tag2\"]',
  "    }",
  "  ]",
  "}",
  "Rules:",
  "- Generate exactly 14 posts total: 7 LinkedIn and 7 Twitter.",
  "- For each dayIndex 1 to 7, provide one LinkedIn and one Twitter post.",
  "- LinkedIn posts should be 400-900 characters.",
  "- Twitter posts should be <= 280 characters.",
  "- Make content practical and specific.",
].join("\n");

async function generateDevLogCalendar({ repositoryName, sourceType, sourceText }) {
  const userPrompt = [
    `Repository: ${repositoryName}`,
    `Source type: ${sourceType}`,
    "Source material:",
    sourceText.slice(0, 15000),
  ].join("\n\n");

  try {
    const openaiClient = getClient();
    const response = await openaiClient.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
      temperature: 0.8,
    });

    const rawOutput = response.output_text;
    if (!rawOutput) {
      throw new Error("OpenAI returned an empty response.");
    }

    const parsed = JSON.parse(rawOutput);
    if (!parsed.posts || !Array.isArray(parsed.posts) || parsed.posts.length !== 14) {
      throw new Error("OpenAI response is missing the expected 14-post calendar.");
    }

    return parsed;
  } catch (_error) {
    return createFallbackCalendar(repositoryName, sourceType, sourceText);
  }
}

module.exports = {
  SYSTEM_PROMPT,
  generateDevLogCalendar,
};