import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { Conversation, Message } from '../../db';

@injectable()
export class CreateDallECommand implements ICommandStrategy {
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;

  public constructor(@inject(TYPES.AiClient) aiClient: OpenAiClient) {
    this.aiClient = aiClient;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const imgageUrls = await this.aiClient.generateImage(args[0]);
    let message: Message = new Message();
    message.role = "assistant";
    message.content = imgageUrls.toString();    
    conversation.messages?.push(message);    
    console.log('Images generated: ');
    imgageUrls.forEach((imageUrl) => {
      console.log(imageUrl);
    });

    return false;
  }
}
