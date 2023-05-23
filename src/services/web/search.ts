// Import necessary modules
import dotenv from 'dotenv';
import axios from 'axios';
import { IStrategy } from '../../types';
import { injectable } from 'inversify';
import SearchResult from '../../entities/web/SearchResult';

@injectable()
class Search implements IStrategy<SearchResult[]> {
    name: string;

    constructor() {
        this.name = "search";
      }


    public async execute(input: string[]): Promise<SearchResult[]> {
        // Load the environment variables from the .env file
        dotenv.config();

        const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY || "";
        const CUSTOM_SEARCH_CX: string = '47912e7ac291647d8';  // Replace this with your Custom Search Engine CX
          const url = `https://customsearch.googleapis.com/customsearch/v1?q=${input[0]}&cx=${CUSTOM_SEARCH_CX}&key=${GOOGLE_API_KEY}`;
        
          try {
            const response = await axios.get(url);
        
            const searchResults: SearchResult[] = response.data.items.map((item: any) => ({
              title: item.title,
              link: item.link,
              snippet: item.snippet,
              imageUrl: item.pagemap?.cse_image?.[0].src
            }));
        
            return searchResults;
          } catch (error) {
            console.error('Failed to perform search:', error);
            return [];
          }
    }
}

export default Search;
