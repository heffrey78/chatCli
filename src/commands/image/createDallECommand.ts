import { inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { ConversationService } from '../../services/conversation/conversationService';
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "CreateDallECommand",
  description: "Calls the OpenAI DALL-E generations endpoint creating 2 varations based on a prompt, adding the image urls to a new message",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the image generation prompt"
    }
  },
  required: ["args"],
})
export class CreateDallECommand implements ICommandStrategy {
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
    const imgageUrls = await this.aiClient.generateImage(args[0]);
    this.conversationService.addMessage("assistant", imgageUrls.toString()); 
    console.log('Images generated: ');
    imgageUrls.forEach((imageUrl) => {
      console.log(imageUrl);
    });

    return false;
  }
}
