const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function extractMainContent(url) {
  // Fetch the HTML content from the given URL
  const response = await axios.get(url);

  // Load the fetched HTML content using Cheerio, a library for web scraping
  const $ = cheerio.load(response.data);

  // Extract the main text content from the page using CSS selectors
  const mainTextContent = $('body').text();

  // Return the extracted text content
  return mainTextContent.trim();
}

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

module.exports = { 
  convertWebpageToPdf, 
  extractMainContent };

