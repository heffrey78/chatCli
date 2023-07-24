import { inject } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getDirectoryStructureAsString } from "../../services/file/fileManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "AddDirectoryCommand",
  description: "Reads the current working directory and adds the file and folder structure as a message",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args is unused"
    }
  },
  required: ["args"],
})
export class AddDirectoryCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    const dirStructure = await getDirectoryStructureAsString("./");
    this.conversationService.addMessage("user", dirStructure);
    console.log("Working directory added");

    return false;
  }
}
