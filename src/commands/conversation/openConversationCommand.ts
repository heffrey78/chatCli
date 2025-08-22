import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "OpenMessagesCommand",
  description: "Opens a conversation from the database by conversation name",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the name of the conversation to open"
    }
  },
  required: ["args"],
})
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
