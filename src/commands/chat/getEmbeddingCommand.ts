import { ICommandStrategy } from '../../interfaces/ICommandStrategy';
import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { saveJsonFile } from "../../services/file/fileManager";
import { ConversationService } from '../../services/conversation/conversationService';
import { functionDetails } from '../../decorators/functionalDetails';

@functionDetails({
  name: "GetEmbeddingCommand",
  description: "Calls the OpenAI Embeddings API with a string to embed.",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] contains the string to embed"
    }
  },
  required: ["args"],
})
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