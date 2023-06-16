import { container } from "./inversify.config";
import { TYPES, IMessage, ParsedPrompt, extractCommandLabels } from "./types";
import { ICommandStrategy } from "./interfaces/ICommandStrategy";
import { IConfiguration } from "./interfaces/IConfiguration";

// Import other required modules and functions

async function handlePrompt(
  prompt: string,
  messages: IMessage[]
): Promise<boolean | undefined> {
  const parsedPrompt = parsePrompt(prompt);
  const commandName = parsedPrompt
    ? parsedPrompt.command.replace(/[\r\n]/gm, "").toUpperCase()
    : null;
  const args = parsedPrompt ? parsedPrompt.args : [];
  const config = container.get<IConfiguration>(TYPES.Configuration);

  const commandSymbol = commandName
    ? TYPES.Command[commandName]
    : config.code
    ? TYPES.Command["GenerateCodeCommand"]
    : TYPES.Command["GenerateChatCommand"];

  // FOR POTENTIAL USE IN USING GPT (3.5) TO GET A COMMAND...EVENTUALLY EMBEDDINGS

  //const list = container.getAll<ICommandStrategy>('ICommandStrategy');

  if (commandSymbol == TYPES.Command["GenerateCodeCommand"]) {
    const systemInfo = TYPES.SystemInformation;
    const systemMessage =
      ` Unless otherwise specificed, development should target a system with the following information: ${JSON.stringify(
        systemInfo
      )} \r\n` +
      " Act as an expert in mentioned technologies. Use best practices. Create a directory structure, but only use it to add a comment at the top of each file with only an appropriate filename and no other information";

      const setSystemMessageCommand = container.get<ICommandStrategy>(TYPES.Command.SETSYSTEM);
      return await setSystemMessageCommand.execute([systemMessage], messages);
  }

  if (!commandName) {
    messages.push({ role: "user", content: prompt });
  }

  if (commandSymbol) {
    const command = container.get<ICommandStrategy>(commandSymbol);
    return await command.execute(args, messages);
  } else {
    console.log("Unknown command");
    return false;
  }
}

function parsePrompt(prompt: string): ParsedPrompt | undefined {
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
      text = text.substring(commandEnd + 1);

      if (
        (text.startsWith("'") && text.endsWith("'")) ||
        (text.startsWith('"') && text.endsWith('"'))
      ) {
        text = text.slice(1, -1);
      }
      argText = text.trim();
    }

    let match: RegExpExecArray | null;
    let re = /"([^"]*)"|'([^']*)'|([^ ]+)/g;
    while ((match = re.exec(text))) {
      let arg = match[1] || match[2] || match[3];
      args.push(arg);
    }

    return { command, args, argText };
  }

  return;
}

export { parsePrompt, handlePrompt };
