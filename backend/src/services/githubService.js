const axios = require("axios");

const GITHUB_API_BASE = "https://api.github.com";

function parseGitHubUrl(githubUrl) {
  try {
    const parsed = new URL(githubUrl);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL.");
    }
    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch (error) {
    throw new Error("Malformed GitHub URL.");
  }
}

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchReadme(owner, repo) {
  const response = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
    headers: buildHeaders(),
  });

  const { content, encoding } = response.data;
  if (encoding !== "base64" || !content) {
    throw new Error("README content format is not supported.");
  }

  return Buffer.from(content, "base64").toString("utf-8");
}

async function fetchRecentCommits(owner, repo, limit = 8) {
  const response = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`, {
    params: { per_page: limit },
    headers: buildHeaders(),
  });

  return response.data.map((commit) => commit.commit && commit.commit.message).filter(Boolean);
}

async function getRepositoryContext(githubUrl) {
  const { owner, repo } = parseGitHubUrl(githubUrl);

  try {
    const readme = await fetchReadme(owner, repo);
    return {
      owner,
      repo,
      sourceType: "readme",
      sourceText: readme,
    };
  } catch (_readmeError) {
    const commitMessages = await fetchRecentCommits(owner, repo);
    return {
      owner,
      repo,
      sourceType: "commits",
      sourceText: commitMessages.join("\n"),
    };
  }
}

module.exports = {
  parseGitHubUrl,
  getRepositoryContext,
};