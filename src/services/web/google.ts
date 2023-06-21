// Import necessary modules
import dotenv from "dotenv";
import axios from "axios";
import { SearchResult } from "../../types";
import { injectable } from "inversify";
import { ISearch as SearchHandler } from "../../interfaces/web/ISearch";

@injectable()
export class Google implements SearchHandler {
  name: string;

  constructor() {
    this.name = "google";
  }

  public async execute(input: string): Promise<SearchResult[]> {
    dotenv.config();

    const GOOGLE_API_KEY: string = process.env.GOOGLE_API_KEY || "";
    const CUSTOM_SEARCH_CX: string = "47912e7ac291647d8"; // Replace this with your Custom Search Engine CX
    const url = `https://customsearch.googleapis.com/customsearch/v1?q=${input}&cx=${CUSTOM_SEARCH_CX}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await axios.get(url);

      const searchResults: SearchResult[] = response.data.items.map(
        (item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          imageUrl: item.pagemap?.cse_image?.[0].src,
        })
      );

      return searchResults;
    } catch (error) {
      console.error("Failed to perform search:", error);
      return [];
    }
  }

  getSummarizedItems(searchResults: any[]): SearchResult[] {
    // Extract the list of summarized items from the search results
    const summarizedItems: SearchResult[] = searchResults.map((result) => {
      return {
        title: result.title,
        link: result.link,
        snippet: result.snippet as string,
        imageUrl: result.pagemap?.cse_image?.[0].src
      };
    });
  
    // Return the list of summarized items
    return summarizedItems;
  }
}

