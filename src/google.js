// Import necessary modules
const dotenv = require('dotenv');
const axios = require('axios');

// Load the environment variables from the .env file
dotenv.config();

// Define your API URL and other necessary information
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CUSTOM_SEARCH_CX = '47912e7ac291647d8';  // Replace this with your Custom Search Engine CX
const GOOGLE_API_URL = 'https://customsearch.googleapis.com/customsearch/v1';

// Function for fetching search results
async function search(searchText) {
    try {
      // Make an HTTP GET request to the Google Search API
      const response = await axios.get(GOOGLE_API_URL, {
        params: {
          key: GOOGLE_API_KEY,
          cx: CUSTOM_SEARCH_CX,
          q: searchText,
        },
      });
  
      // Return the search results
      return response.data.items;
    } catch (error) {
      console.error(`Error fetching search results: ${error}`);
    }
  }

// Function for extracting summarized items from the search results
function getSummarizedItems(searchResults) {
    // Extract the list of summarized items from the search results
    const summarizedItems = searchResults.map(result => {
      return {
        title: result.title,
        snippet: result.snippet,
        formattedUrl: result.formattedUrl,
        htmlSnippet: result.htmlSnippet,
      };
    });
  
    // Return the list of summarized items
    return summarizedItems;
}
  

// Async function for fetching search results and extracting the summarized items
async function searchAndGetSummarizedItems(searchText) {
    // Fetch search results
    const searchResults = await search(searchText);
  
    // Extract summarized items from the search results
    const summarizedItems = getSummarizedItems(searchResults);
  
    // Return the list of summarized items
    return summarizedItems;
  }
  

module.exports = {
    search,
    searchAndGetSummarizedItems
  };
  