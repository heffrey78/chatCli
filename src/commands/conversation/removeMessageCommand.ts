import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "RemoveMessageCommand",
  description: "Removes a message from a conversation",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the index of the message to remove"
    }
  },
  required: ["args"],
})
export class RemoveMessageCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
this.conversationService = conversationService;
  }
  
  async execute(args: string[]): Promise<boolean> {
    if(args[0]) {
        let numberFromString: number = parseInt(args[0]);
        this.conversationService.remove(numberFromString);
    }
    
    return false;
  }
}