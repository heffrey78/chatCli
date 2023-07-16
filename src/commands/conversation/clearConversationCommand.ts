import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";

@injectable()
export class ClearConversationCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    this.conversationService.clear();
    return false;
  }
}
