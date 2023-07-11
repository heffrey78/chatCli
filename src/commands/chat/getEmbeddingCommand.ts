import { ICommandStrategy } from '../../interfaces/ICommandStrategy';
import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { saveJsonFile } from "../../services/file/fileManager";
import { Conversation } from '../../db';

@injectable()
export class GetEmbeddingCommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient

  public constructor(@inject(TYPES.AiClient) aiClient: OpenAiClient) {
    this.aiClient = aiClient;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const inputText: string = args[0];
    const embedding: number[] = await this.aiClient.embed(inputText);

    saveJsonFile("./output/embedding.json", JSON.stringify(embedding));
  
    console.log("Embedding saved");
    
    return false;
  }
}