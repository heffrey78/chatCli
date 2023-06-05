import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { saveMessagesToFile } from "../../services/file/fileManager";
import { injectable } from "inversify";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {  
  async execute(args: string[], messages: any[]): Promise<boolean> {
    await saveMessagesToFile(args[0], messages);
    console.log(`${args} saved`);
    return false;
  }
}