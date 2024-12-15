const { Snack } = require("snack-sdk");
const fs = require("fs");

// Chargez le code de votre projet
const appTsxCode = fs.readFileSync("./App.tsx", "utf8");
const appJsCode = `import App from './App.tsx'; export default App;`;

// Créez un nouveau Snack
const snack = new Snack({
  code: {
    "App.js": appJsCode,  // Crée un fichier App.js qui importe App.tsx
    "App.tsx": appTsxCode,  // Utilise ton fichier App.tsx
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
