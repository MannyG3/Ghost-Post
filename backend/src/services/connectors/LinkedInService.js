const axios = require("axios");

class LinkedInService {
  async publishPost(post, connectorAuth = {}) {
    const accessToken =
      connectorAuth.accessToken || post.linkedinAccessToken || process.env.LINKEDIN_ACCESS_TOKEN;
    const authorUrn =
      connectorAuth.authorUrn || post.linkedinAuthorUrn || process.env.LINKEDIN_AUTHOR_URN;

    if (!accessToken || !authorUrn) {
      throw new Error("Missing LinkedIn credentials (access token and author URN).");
    }

    const payload = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: post.content,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await axios.post("https://api.linkedin.com/v2/ugcPosts", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });

    return {
      platform: "linkedin",
      providerPostId: response.headers["x-restli-id"] || null,
      raw: response.data,
    };
  }
}

module.exports = new LinkedInService();