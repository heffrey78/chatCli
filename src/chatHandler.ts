import { injectable, inject } from "inversify";
import { container } from "./inversify.config";
import { TYPES, ParsedPrompt, Handler } from "./types";
import { ICommandStrategy } from "./interfaces/ICommandStrategy";
import { SystemInformation } from "./services/system/SystemInformation";
import { Configuration } from "./config/Configuration";
import { Conversation, Message } from "./db";

@injectable()
class ChatHandler implements Handler {
  @inject(TYPES.SystemInformation) private systemInformation: SystemInformation;
  @inject(TYPES.Configuration) private configuration: Configuration;

  public constructor(
    @inject(TYPES.SystemInformation) systemInformation: SystemInformation,
    @inject(TYPES.Configuration) configuration: Configuration
  ) {
    this.systemInformation = systemInformation;
    this.configuration = configuration;
  }

  public async handle(
    prompt: string,
    conversation: Conversation
  ): Promise<boolean | undefined> {
    const parsedPrompt = this.parsePrompt(prompt);
    const commandName = parsedPrompt
      ? parsedPrompt.command.replace(/[\r\n]/gm, "").toUpperCase()
      : null;
    const args = parsedPrompt ? parsedPrompt.args : [];

    const commandSymbol = commandName
      ? TYPES.Command[commandName]
      : this.configuration.code
      ? TYPES.Command["GenerateCodeCommand"]
      : TYPES.Command["GenerateChatCommand"];

    if (commandSymbol == TYPES.Command["GenerateCodeCommand"]) {
      const systemMessage = `Development should target a system with the following information: ${JSON.stringify(
        this.systemInformation
      )} \r\n Act as an expert in mentioned technologies. Use best practices. Create a directory structure, and use it to add a comment at the top of each file. The comment should only be an appropriate filename with no other information`;
      const setSystemMessageCommand = container.get<ICommandStrategy>(
        TYPES.Command.SETSYSTEM
      );
      await setSystemMessageCommand.execute([systemMessage], conversation);
    }

    if (!commandName) {
      let message: Message = new Message();
      message.role = "user";
      message.content = prompt;
      conversation.messages?.push(message);
    }

    if (commandSymbol) {
      const command = container.get<ICommandStrategy>(commandSymbol);
      return await command.execute(args, conversation);
    } else {
      console.log("Unknown command");
      return false;
    }
  }

  private parsePrompt(prompt: string): ParsedPrompt | undefined {
    if (prompt.indexOf(".") === 0) {
      // Remove the leading dot
      let text = prompt.substring(1);
      let command: string;
      let args: string[] = [];
      let argText: string;

      let commandEnd = text.indexOf(" ");
      if (commandEnd === -1) {
        command = text;
        argText = "";
      } else {
        command = text.substring(0, commandEnd).toUpperCase();
        argText = text
          .substring(commandEnd + 1)
          .trim()
          .replace(/\r?\n|\r/g, "");

        let match: RegExpExecArray | null;
        let re = /"([^"]*)"|'([^']*)'|([^ ]+)/g;
        while ((match = re.exec(argText))) {
          args.push(match[1] || match[2] || match[3]);
        }
      }

      return { command, args, argText };
    }
  }
}

export { ChatHandler };
