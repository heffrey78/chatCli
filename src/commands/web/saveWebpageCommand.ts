import { ICommandStrategy } from "../../interfaces/ICommandStrategy";import { saveMessagesToFile } from "../../services/file/fileManager";
import { inject, injectable } from "inversify";
import { convertWebpageToPdf } from "../../services/web/webManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";

@injectable()
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