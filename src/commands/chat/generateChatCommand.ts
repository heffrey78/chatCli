import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { getChatCompletion } from "../../services/openai";

@injectable()
export class GenerateChatCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const response = await getChatCompletion(messages);
    messages.push({ role: "assistant", content: response });
    console.log("Assistant:", response);

    return false;
  }
}
