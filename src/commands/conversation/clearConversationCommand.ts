import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "ClearConversationCommand",
  description: "Clears the current conversation",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args is unused"
    }
  },
  required: ["args"],
})
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
