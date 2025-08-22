import { inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { ConversationService } from '../../services/conversation/conversationService';
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
    name: "GetHelpCommand",
    description: "Gets a list of all of the commands available",
    parameters: {
      args: {
        type: "array",
        items: { type: "string "},
        description: "No args required"
      }
    },
    required: ["args"],
  })
export class GetHelpCommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.AiClient) aiClient: OpenAiClient,
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.aiClient = aiClient;
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    // Assuming the TYPES object has an array of all command names under a symbol for commands
    const commandNames = Object.keys(TYPES.Command).map((symbol) => (symbol as keyof typeof TYPES.Command));
    
    let helpText = `Available Commands:\n`;
    helpText += commandNames.join("\n");
    console.log(helpText);

    this.conversationService.addMessage("assistant", helpText); 

    return false; // Returning true or false based on your desired behavior, for simplicity, returning false here.
  }
}
