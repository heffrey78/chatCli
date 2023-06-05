import { ICommandStrategy } from "../../interfaces/ICommandStrategy";import { saveMessagesToFile } from "../../services/file/fileManager";
import { injectable } from "inversify";
import { convertWebpageToPdf } from "../../services/web/webManager";
import { IMessage } from "../../types";

@injectable()
export class SaveWebpageCommand implements ICommandStrategy {  
  async execute(args: string[], messages: any[]): Promise<boolean> {
    await convertWebpageToPdf(args[0], args[1]);
    let message: IMessage = {role:"user", content:`${args[0]} saved to: ${args[1]}`};
    messages.push(message);
    return false;
  }
}