import { injectable, inject } from "inversify";
import { container } from "./inversify.config";
import { TYPES, ParsedPrompt } from "./types";
import { ICommandStrategy } from "./interfaces/ICommandStrategy";
import { SystemInformation } from "./services/system/SystemInformation";
import { Configuration } from "./config/Configuration";
import { ConversationService } from "./services/conversation/conversationService";
import { functionDetailsKey, functionDetails } from "./decorators/functionalDetails";

@injectable()
class ChatHandler implements ICommandStrategy {
  @inject(TYPES.SystemInformation) private systemInformation: SystemInformation;
  @inject(TYPES.Configuration) private configuration: Configuration;
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.SystemInformation) systemInformation: SystemInformation,
    @inject(TYPES.Configuration) configuration: Configuration,
    @inject(TYPES.Services.ConversationService) conversationService: ConversationService
  ) {
    this.systemInformation = systemInformation;
    this.configuration = configuration;
    this.conversationService = conversationService;
  }

  public async execute(
    args: string[]
  ): Promise<boolean> {
  //   const commands = container.getAll<ICommandStrategy>(TYPES.ICommandStrategy);

  //   const functions = commands.map(command => {
  //   const functionDetails = Reflect.getMetadata(functionDetailsKey, command.constructor);
  //   functionDetails.array.forEach((functionalDetail: any) => {
  //     console.log(JSON.stringify(functionalDetail));
  //   });
  // });


    const parsedPrompt = this.parsePrompt(args[0]);
    const commandName = parsedPrompt
      ? parsedPrompt.command.replace(/[\r\n]/gm, "").toUpperCase()
      : null;
    const derivedargs = parsedPrompt ? parsedPrompt.args : args;

    const commandSymbol = commandName
      ? TYPES.Command[commandName]
      : this.configuration.code
      ? TYPES.Command["GenerateCodeCommand"]
      : TYPES.Command["GenerateChatCommand"];

    if (commandSymbol) {
      const command = container.get<ICommandStrategy>(commandSymbol);
      return await command.execute(derivedargs);
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
