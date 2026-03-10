const Project = require("../models/Project");
const Post = require("../models/Post");
const { parseGitHubUrl, getRepositoryContext } = require("./githubService");
const { generateDevLogCalendar } = require("./aiContentService");

function computeScheduledDate(dayIndex) {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + (dayIndex - 1));
  return date;
}

function normalizePostPayload(aiPost, summary, userId, projectId) {
  return {
    userId,
    projectId,
    dayIndex: aiPost.dayIndex,
    platform: aiPost.platform,
    title: aiPost.title,
    content: aiPost.content,
    hashtags: aiPost.hashtags || [],
    scheduledDate: computeScheduledDate(aiPost.dayIndex),
    status: "draft",
    sourceSummary: summary,
  };
}

async function generateContentCalendar({ userId, githubUrl }) {
  const { owner, repo } = parseGitHubUrl(githubUrl);

  const project = await Project.findOneAndUpdate(
    { userId, githubUrl },
    {
      $set: {
        userId,
        name: repo,
        sourceType: "github",
        githubUrl,
        lastGeneratedAt: new Date(),
      },
    },
    { new: true, upsert: true }
  );

  const repositoryContext = await getRepositoryContext(githubUrl);
  const aiOutput = await generateDevLogCalendar({
    repositoryName: `${owner}/${repo}`,
    sourceType: repositoryContext.sourceType,
    sourceText: repositoryContext.sourceText,
  });

  await Post.deleteMany({ projectId: project._id, status: "draft" });

  const docs = aiOutput.posts.map((post) =>
    normalizePostPayload(post, aiOutput.summary || "", userId, project._id)
  );

  const insertedPosts = await Post.insertMany(docs);

  return {
    project,
    summary: aiOutput.summary,
    posts: insertedPosts,
    sourceTypeUsed: repositoryContext.sourceType,
  };
}

module.exports = {
  generateContentCalendar,
};