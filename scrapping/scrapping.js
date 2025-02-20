// Code pour le scrapping des données de football

const puppeteer = require("puppeteer");

async function scrapeQuotes() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://fr.wikipedia.org/wiki/Ballon_d%27or#cite_note-8");

  // Code pour extraire les données
  const football = await page.evaluate(() => {
    const gentil = 3;
    return gentil;
  });

  await browser.close();
}

// Lancer le scrapping
scrapeQuotes();
