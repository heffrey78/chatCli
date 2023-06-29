import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { IMessage } from "../../types";

@injectable()
export class ClearMessagesCommand implements ICommandStrategy {
  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    messages.length = 0;
    return false;
  }
}