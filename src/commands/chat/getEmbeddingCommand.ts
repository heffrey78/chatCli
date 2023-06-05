import { ICommandStrategy } from '../../interfaces/ICommandStrategy';
import { injectable } from 'inversify';
import { IMessage } from "../../types";
import { createEmbedding } from '../../services/openai/openAiClient';
import { saveJsonFile } from "../../services/file/fileManager";

@injectable()
export class GetEmbeddingCommand implements ICommandStrategy {
  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    const inputText: string = args[0];
    const embedding: number[] = await createEmbedding(inputText);

    saveJsonFile("./output/embedding.json", JSON.stringify(embedding));
  
    console.log("Embedding saved");

    console.log('Embedding added to messages.');
    return false;
  }
}