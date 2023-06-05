import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { IMessage } from "../../types";

@injectable()
export class ListMessagesCommand implements ICommandStrategy {
  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    let counter: number = 0;

    messages.forEach((message: IMessage) => {
      console.log(`Id: ${counter}, Role: ${message.role} \n Content: ${JSON.stringify(message.content)}`);
      counter++;
    });
    return false;
  }
}