import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { readPDFToString } from "../../services/file/fileManager";


@injectable()
export class ReadPdfCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const contents = await readPDFToString(args[0]);
    messages.push({ role: "user", content: contents });
    console.log("Contents added");

    return false;
  }
}
