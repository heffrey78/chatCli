import { inject, injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { TYPES, IMessage, ISearch, SearchResult } from "../../types";

@injectable()
export class GoogleSearchCommand implements ICommandStrategy {
  search: ISearch;

  public constructor(@inject(TYPES.ISearch) search: ISearch) {
    this.search = search;
  }

  async execute(args: string[], messages: any[]): Promise<boolean> {
    const result = await this.search.execute(args[0]);
    const escapedResults = result.map((r: SearchResult) => ({
        ...r,
        link: encodeURIComponent(r.link),
        imageUrl: r.imageUrl ? encodeURIComponent(r.imageUrl) : undefined,
        title: encodeURIComponent(r.title),
        snippet: encodeURIComponent(r.snippet)
      }));

      let lines = ""
      
      escapedResults.forEach((searchResult: SearchResult) => {
        const line = `Title: ${searchResult.title}, Snippet: ${searchResult.snippet}, Link: ${searchResult.link} : `;
        lines += line + ', ';
        console.log(line);
      });
      let message: IMessage = { role: "user", content: lines.replace(/\\"/g, '').replace(/"/g, '') };
      messages.push(message);
      return false;
  }
}
