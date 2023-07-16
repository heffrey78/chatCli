import { ICommandStrategy } from '../../interfaces/ICommandStrategy';
import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { saveJsonFile } from "../../services/file/fileManager";
import { ConversationService } from '../../services/conversation/conversationService';

@injectable()
export class GetEmbeddingCommand implements ICommandStrategy {
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
    const inputText: string = args[0];
    const embedding: number[] = await this.aiClient.embed(inputText);

    saveJsonFile("./output/embedding.json", JSON.stringify(embedding));
  
    console.log("Embedding saved");
    
    return false;
  }
}