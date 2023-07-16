import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";

@injectable()
export class OpenMessagesCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  async execute(args: string[]): Promise<boolean> {
    let conversation = await this.conversationService.load(args[0]);
    console.log(`Loaded ${conversation.name}`);
    return false;
  }
}
