import { inject } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { TYPES, ISearch, SearchResult } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "GoogleSearchCommand",
  description: "Executes a Google search and returns a list of results",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is a string containing the search terms"
    }
  },
  required: ["args"],
})
export class GoogleSearchCommand implements ICommandStrategy {
  @inject(TYPES.SearchHandler) private search: ISearch;
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.SearchHandler) search: ISearch,
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
    ) {
    this.search = search;
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
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

      this.conversationService.addMessage("user", lines.replace(/\\"/g, '').replace(/"/g, ''));

      return false;
  }
}
