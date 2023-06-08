import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getDirectoryStructureAsString } from "../../services/file/fileManager";

@injectable()
export class AddDirectoryCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const dirStructure = await getDirectoryStructureAsString('./');
    messages.push({ role: "user", content: dirStructure });
    console.log("Working directory added");

    return false;
  }
}
