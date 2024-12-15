const { Snack } = require("snack-sdk");
const fs = require("fs");

// Chargez le code de votre projet
const code = fs.readFileSync("./App.js", "utf8");

// Créez un nouveau Snack
const snack = new Snack({
  code: {
    "App.js": code,
  },
  dependencies: {
    "expo": "latest",
    "react": "latest",
    "react-native": "latest",
  },
});

// Publiez le Snack
(async () => {
  const { id } = await snack.saveAsync();
  console.log(`Snack publié : https://snack.expo.dev/${id}`);
})();
