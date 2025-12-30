const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // On n'accepte que les envois (POST)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    const { fileName, content } = JSON.parse(event.body);
    
    // On utilise le Token caché dans Netlify (MY_GITHUB_TOKEN)
    const octokit = new Octokit({
      auth: process.env.MY_GITHUB_TOKEN
    });

    // On envoie l'image dans le dossier /images de ton GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: "jerboyspy",
      repo: "Lesbouclesdelydie",
      path: `images/${fileName}`,
      message: `Admin : Ajout photo ${fileName}`,
      content: content,
      branch: "main"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: `/images/${fileName}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
