import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getCodeCompletion } from "../../services/openai";

@injectable()
export class GenerateCodeCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const response = await getCodeCompletion(messages);
    messages.push({ role: "assistant", content: response });
    console.log("Assistant:", response);

    return false;
  }
}
