import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { Conversation, Message } from '../../db';

@injectable()
export class GenerateCodeCommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;

  public constructor(@inject(TYPES.AiClient) aiClient: OpenAiClient) {
    this.aiClient = aiClient;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const response = await this.aiClient.complete(conversation);
    let message: Message = new Message();
    message.role = "assistant";
    message.content = response;    
    conversation.messages?.push(message);
    console.log("Assistant:", response);

    return false;
  }
}
