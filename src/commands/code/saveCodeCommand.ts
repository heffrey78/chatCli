import { inject } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import extractAndWriteCodeToFile from "../../services/code/codeManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from '../../decorators/functionalDetails';

@functionDetails({
  name: "SaveCodeCommand",
  description: "Parses a message from an array of messages given an index and saves code to an output directory",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] contains the index of the message to process"
    }
  },
  required: ["args"],
})
export class SaveCodeCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  
  
  async execute(args: string[]): Promise<boolean> {
    let index = parseInt(args[0]);
    let message = this.conversationService.getMessage(index);
    if(message){
      await extractAndWriteCodeToFile(message.content, './output/');
      console.log("Code saved.");
    }

    return false;
  }
}
