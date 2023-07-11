import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getDirectoryStructureAsString } from "../../services/file/fileManager";
import { Conversation, Message } from "../../db";

@injectable()
export class AddDirectoryCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const dirStructure = await getDirectoryStructureAsString('./');
    let message = new Message();
    message.role = "user";
    message.content = dirStructure;
    conversation.messages?.push(message);
    console.log("Working directory added");

    return false;
  }
}
