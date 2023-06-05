import { SearchResult } from "../../types";

export interface ISearch {
  execute(input: string): Promise<SearchResult[]>;
}
