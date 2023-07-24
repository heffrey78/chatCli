import { inject } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { readPDFToString } from "../../services/file/fileManager";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "ReadPdfCommand",
  description: "Opens a PDF and adds the text contents as a new message",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the name of the PDF to read"
    }
  },
  required: ["args"],
})
export class ReadPdfCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    const contents = await readPDFToString(args[0]);
    this.conversationService.addMessage("user", contents);
    console.log("Contents added");

    return false;
  }
}
