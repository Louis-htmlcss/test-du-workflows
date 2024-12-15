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
