import { ICommandStrategy } from "../../interfaces/ICommandStrategy";import { saveMessagesToFile } from "../../services/file/fileManager";
import { inject } from "inversify";
import { convertWebpageToPdf } from "../../services/web/webManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "SaveWebpageCommand",
  description: "Saves a web page's contents to PDF",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is a string containing the web page's url"
    }
  },
  required: ["args"],
})
export class SaveWebpageCommand implements ICommandStrategy {  
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  
  async execute(args: string[]): Promise<boolean> {
    await convertWebpageToPdf(args[0], args[1]);
    this.conversationService.addMessage("user", `${args[0]} saved to: ${args[1]}`);
 
    return false;
  }
}