import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
//import { directoryStructureToTerseJson } from "../../directoryStructure";

@injectable()
export class AddDirectoryCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    // const dirStructure = await directoryStructureToTerseJson();
    // messages.push({ role: "user", content: dirStructure });
    console.log("Working directory added");

    return false;
  }
}
