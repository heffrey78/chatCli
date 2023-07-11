import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import extractAndWriteCodeToFile from "../../services/code/codeManager";
import { Conversation } from "../../db";

@injectable()
export class SaveCodeCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    let index = parseInt(args[0]);
    let message = conversation.messages?.at(index);
    if(message){
      await extractAndWriteCodeToFile(message.content, './output/');
      console.log("Code saved.");
    }

    return false;
  }
}
