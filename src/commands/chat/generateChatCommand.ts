import { inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { ConversationService } from '../../services/conversation/conversationService';
import { functionDetails } from '../../decorators/functionalDetails';

@functionDetails({
  name: "GenerateChatCommand",
  description: "Calls the OpenAI Completions API with a prompt.",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] contains the chat prompt"
    }
  },
  required: ["args"],
})
export class GenerateChatCommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.AiClient) aiClient: OpenAiClient,
    @inject(TYPES.Services.ConversationService) conversationService: ConversationService
    ) {
    this.aiClient = aiClient;
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    this.conversationService.addMessage("user", args[0].replace(/[\r\n]/gm, ""));
    const response = await this.aiClient.chat(this.conversationService.get()); 
    this.conversationService.addMessage("assistant", response);  
    console.log("Assistant:", response);

    return false;
  }
}
