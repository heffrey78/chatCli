import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    await this.conversationService.save(args[0]);

    console.log(`${args} saved`);
    return false;
  }
}
