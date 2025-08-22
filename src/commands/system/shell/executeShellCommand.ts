import { inject } from "inversify";
import { ICommandStrategy } from "../../../interfaces/ICommandStrategy";
import { executeShellScript } from "../../../services/file/fileManager";
import { ConversationService } from "../../../services/conversation/conversationService";
import { TYPES } from "../../../types";
import { functionDetails } from "../../../decorators/functionalDetails";

@functionDetails({
  name: "ExecuteShellCommand",
  description: "Executes a shell command",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is a string containing the shell command and arguments"
    }
  },
  required: ["args"],
})
export class ExecuteShellCommand implements ICommandStrategy {  
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  
  async execute(args: string[]): Promise<boolean> {
    const content = args.join(' ').replace(/\r?\n|\r/g, "");
    const result = await executeShellScript(content);
    this.conversationService.addMessage("assistant", result || "No result");   
    console.log(result);
    return false;
  }
}