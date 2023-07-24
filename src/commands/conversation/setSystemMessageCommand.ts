import { inject, injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { TYPES } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "SetSystemMessageCommand",
  description: "Sets the system message to use with Chat GPT",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the system message"
    }
  },
  required: ["args"],
})
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
