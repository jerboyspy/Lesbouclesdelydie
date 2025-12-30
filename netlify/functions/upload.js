const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { fileName, content } = JSON.parse(event.body);
  const octokit = new Octokit({ auth: process.env.MY_GITHUB_TOKEN });

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: "jerboyspy",
      repo: "Lesbouclesdelydie",
      path: `images/${fileName}`,
      message: `Upload photo ${fileName}`,
      content: content,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: `/images/${fileName}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
