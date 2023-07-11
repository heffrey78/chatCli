import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { readPDFToString } from "../../services/file/fileManager";
import { Conversation, Message } from "../../db";


@injectable()
export class ReadPdfCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const contents = await readPDFToString(args[0]);
    let message = new Message();
    message.role = "user";
    message.content = contents;
    conversation.messages?.push(message);
    console.log("Contents added");

    return false;
  }
}
