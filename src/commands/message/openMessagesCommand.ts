import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { readMessagesFromFile } from "../../services/file/fileManager";
import { injectable } from "inversify";
import { IMessage } from "../../types";

@injectable()
export class OpenMessagesCommand implements ICommandStrategy {
  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    const readMessages = await readMessagesFromFile(args[0]);
    readMessages.forEach((message: IMessage) => {
      messages.push({ role: message.role, content: message.content });
    });
    console.log(`Loaded messages from ${args[0]}.json`);
    return false;
  }
}
