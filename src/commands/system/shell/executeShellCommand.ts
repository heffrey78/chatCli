import { injectable } from "inversify";
import { ICommandStrategy } from "../../../interfaces/ICommandStrategy";
import { executeShellScript } from "../../../services/file/fileManager";
import { Conversation, Message } from "../../../db";

@injectable()
export class ExecuteShellCommand implements ICommandStrategy {  
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const content = args.join(' ').replace(/\r?\n|\r/g, "");
    const result = await executeShellScript(content);
    let message: Message = new Message();
    message.role = "assistant";
    message.content = result || "No result";    
    conversation.messages?.push(message);   
    console.log(result);
    return false;
  }
}