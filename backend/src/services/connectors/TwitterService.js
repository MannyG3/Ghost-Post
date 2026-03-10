const axios = require("axios");

class TwitterService {
  async publishPost(post, connectorAuth = {}) {
    const accessToken =
      connectorAuth.accessToken || post.twitterAccessToken || process.env.TWITTER_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Missing Twitter access token.");
    }

    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      {
        text: post.content,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      platform: "twitter",
      providerPostId: response.data && response.data.data ? response.data.data.id : null,
      raw: response.data,
    };
  }
}

module.exports = new TwitterService();