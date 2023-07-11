import { ICommandStrategy } from "../../interfaces/ICommandStrategy";import { saveMessagesToFile } from "../../services/file/fileManager";
import { injectable } from "inversify";
import { convertWebpageToPdf } from "../../services/web/webManager";
import { Conversation, Message } from "../../db";

@injectable()
export class SaveWebpageCommand implements ICommandStrategy {  
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    await convertWebpageToPdf(args[0], args[1]);
    let message: Message = new Message();
    message.role = "user";
    message.content = `${args[0]} saved to: ${args[1]}`;    
    conversation.messages?.push(message);   

    return false;
  }
}