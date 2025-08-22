import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "SaveMessagesCommand",
  description: "Saves the current conversation to the database",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the name to use when saving the conversation"
    }
  },
  required: ["args"],
})
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
