const axios = require('axios');
const cheerio = require('cheerio');

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

module.exports = extractMainContent;

