import SearchResult from "../../entities/web/SearchResult";

interface IStrategySearch {
  execute(input: string): Promise<SearchResult[]>;
}

export default IStrategySearch;