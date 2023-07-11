import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { Conversation, Message } from "../../db";

@injectable()
export class ListMessagesCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    let counter: number = 0;

    conversation.messages?.forEach((message: Message) => {
      console.log(`Id: ${counter}, Role: ${message.role} \n Content: ${JSON.stringify(message.content)}`);
      counter++;
    });
    return false;
  }
}