import { inject, injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";

@injectable()
export class SetSystemMessageCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;
  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  async execute(args: string[]): Promise<boolean> {
    this.conversationService.setSystemMessage(args[0]);

    return false;
  }
}
