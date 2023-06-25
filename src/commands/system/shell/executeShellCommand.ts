import { ICommandStrategy } from "../../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { executeShellScript } from "../../../services/file/fileManager";

@injectable()
export class ExecuteShellCommand implements ICommandStrategy {  
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const content = args.join(' ').replace(/\r?\n|\r/g, "");
    const result = await executeShellScript(content);
    messages.push({ role: "user", content: JSON.stringify(result) });
    console.log(result);
    return false;
  }
}