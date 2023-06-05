import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { generateImage } from "../../services/openai"

@injectable()
export class CreateDallECommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const imgageUrls = await generateImage(args[0]);
    messages.push({ role: "user", content: JSON.stringify(imgageUrls) });
    console.log(`Images generated: 
    ${imgageUrls}`);

    return false;
  }
}
