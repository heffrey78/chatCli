import { injectable, inject } from 'inversify';
import { TYPES, IMessage } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";

@injectable()
export class GenerateCodeCommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;

  public constructor(@inject(TYPES.AiClient) aiClient: OpenAiClient) {
    this.aiClient = aiClient;
  }

  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    const response = await this.aiClient.complete(messages);
    messages.push({ role: "assistant", content: response });
    console.log("Assistant:", response);

    return false;
  }
}
