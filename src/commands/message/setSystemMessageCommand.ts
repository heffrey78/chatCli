import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { IMessage } from "../../types";

@injectable()
export class SetSystemMessageCommand implements ICommandStrategy {  
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const messageIndex = messages.findIndex(
        (message) => message.role === "system"
      );
      if (messageIndex !== -1) {
        messages[messageIndex] = { role: "system", content: args[0] };
      } else {
        this.addSystemMessage(messages, args[0]);
      }
    return false;
  }

    addSystemMessage(messages: IMessage[], systemMessage: string): void {
    messages.push({ role: "system", content: systemMessage });
  }
}