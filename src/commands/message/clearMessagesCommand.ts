import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { Conversation } from "../../db";

@injectable()
export class ClearMessagesCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    conversation.id = 0;
    conversation.name = "";
    conversation.messages = [];
    return false;
  }
}