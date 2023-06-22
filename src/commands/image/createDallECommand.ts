import { injectable, inject } from 'inversify';
import { TYPES, IMessage } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";

@injectable()
export class CreateDallECommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;

  public constructor(@inject(TYPES.AiClient) aiClient: OpenAiClient) {
    this.aiClient = aiClient;
  }

  async execute(args: string[], messages: any[]): Promise<boolean> {
    const imgageUrls = await this.aiClient.generateImage(args[0]);
    messages.push({ role: "user", content: JSON.stringify(imgageUrls) });
    console.log(`Images generated: 
    ${imgageUrls}`);

    return false;
  }
}
