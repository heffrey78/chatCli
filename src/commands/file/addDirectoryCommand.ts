import { inject, injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getDirectoryStructureAsString } from "../../services/file/fileManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";

@injectable()
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
