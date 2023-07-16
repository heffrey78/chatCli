import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { ConversationService } from '../../services/conversation/conversationService';

@injectable()
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
