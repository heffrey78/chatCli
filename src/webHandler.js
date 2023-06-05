const puppeteer = require('puppeteer');

async function convertWebpageToPdf(url, output, options = {}) {
  try {
    // Launch headless Chrome or Chromium browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Go to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Set default options for the PDF if none are provided
    const defaultOptions = {
      path: output,
      format: 'A4',
      printBackground: true
    };

    // Merge default options with any provided custom options
    const pdfOptions = Object.assign({}, defaultOptions, options);

    // Generate and save the PDF
    await page.pdf(pdfOptions);

    // Close the browser
    await browser.close();
  } catch (error) {
    throw error;
  }
}

async function getHeadingsForAllPages(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const pageUrls = await page.$$eval('a', (links) =>
    links.map((link) => link.href)
  );

  let headings = [];

  for (const pageUrl of pageUrls) {
    await page.goto(pageUrl);
    const pageHeadings = await page.$$eval('h1,h2,h3,h4,h5,h6', (tags) =>
      tags.map((tag) => tag.textContent.trim())
    );
    headings.push(...pageHeadings);
  }

  await browser.close();
  return headings;
}

module.exports = { 
  convertWebpageToPdf, getHeadingsForAllPages };

