import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import extractAndWriteCodeToFile from "../../services/code/codeManager";

@injectable()
export class SaveCodeCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    let index = parseInt(args[0]);
    await extractAndWriteCodeToFile(messages[index].content, './output/');
    console.log("Code saved.");

    return false;
  }
}
