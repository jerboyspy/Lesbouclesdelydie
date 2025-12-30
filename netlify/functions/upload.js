const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // Autoriser uniquement les requêtes POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    const { fileName, content } = JSON.parse(event.body);
    
    // Vérification de la présence du token
    const token = process.env.MY_GITHUB_TOKEN;
    if (!token) {
      throw new Error("Le jeton MY_GITHUB_TOKEN est manquant dans Netlify");
    }

    const octokit = new Octokit({ auth: token });

    // Envoi vers GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: "jerboyspy",
      repo: "Lesbouclesdelydie",
      path: `images/${fileName}`,
      message: `Admin : ajout photo ${fileName}`,
      content: content,
      branch: "main" // Vérifiez bien que votre branche s'appelle 'main'
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `/images/${fileName}` }),
    };
  } catch (error) {
    console.error("Erreur détaillée:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
