import { inject, injectable } from "inversify";
import { ICommandStrategy } from "../../../interfaces/ICommandStrategy";
import { executeShellScript } from "../../../services/file/fileManager";
import { ConversationService } from "../../../services/conversation/conversationService";
import { TYPES } from "../../../types";

@injectable()
export class ExecuteShellCommand implements ICommandStrategy {  
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  
  async execute(args: string[]): Promise<boolean> {
    const content = args.join(' ').replace(/\r?\n|\r/g, "");
    const result = await executeShellScript(content);
    this.conversationService.addMessage("assistant", result || "No result");   
    console.log(result);
    return false;
  }
}