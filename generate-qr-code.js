const core = require('@actions/core');
const github = require('@actions/github');
const QRCode = require('qrcode');
const fs = require('fs');

// Récupérer les informations sur la PR
const { pull_request } = github.context.payload;
const { user, head } = pull_request;

// Construire l'URL du lien Snack
const snackUrl = `https://snack.expo.dev/@git/github.com/${user.login}/${head.repo.name}@${head.ref}`;

// Générer le QR code
QRCode.toFile('./qr_code.png', snackUrl, (err) => {
  if (err) throw err;
  console.log(`QR Code généré pour : ${snackUrl}`);
});

// Optionnel: afficher l'URL du Snack dans les logs
core.info(`QR Code généré pour Snack : ${snackUrl}`);

// Ajouter un commentaire à la PR avec l'URL du Snack et l'image du QR code
const octokit = github.getOctokit(core.getInput('github-token')); // GitHub token pour API

(async () => {
  try {
    // Créer un commentaire avec l'URL Snack et le QR code
    const message = `Voici le QR Code pour tester la PR sur Expo Snack : ${snackUrl}`;

    // Charger le fichier image du QR code
    const qrCodeImage = fs.readFileSync('./qr_code.png');

    // Télécharger l'image dans GitHub (GitHub permet de télécharger des images dans les commentaires)
    const uploadResponse = await octokit.rest.repos.createCommitStatus({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.sha,
      state: 'success',
      context: 'QR Code',
      description: 'QR Code pour tester la PR',
      target_url: snackUrl,
    });

    // Publier le commentaire avec l'image du QR code
    await octokit.rest.issues.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pull_request.number,
      body: `${message}\n\n![QR Code](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/raw/main/qr_code.png)`
    });

    console.log("Commentaire avec QR Code ajouté à la PR!");
  } catch (error) {
    core.setFailed(error.message);
  }
})();
