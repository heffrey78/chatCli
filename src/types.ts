import { Conversation } from "./database/entities/Conversation";
import { ICommandStrategy } from "./interfaces/ICommandStrategy";
import { ISearch } from "./interfaces/web/ISearch";

const TYPES = {
  Command: {
    CALENDAR: Symbol.for("GoogleCalendarCommand"),
    CLEAR: Symbol.for("ClearMessagesCommand"),
    CONFIG: Symbol.for("SaveConfigCommand"),
    EXECUTE: Symbol.for("ExecuteShellCommand"),
    GETDIR: Symbol.for("AddDirectoryCommand"),
    GETEMBEDDING: Symbol.for("GetEmbeddingCommand"),
    GOOGLE: Symbol.for("GoogleSearchCommand"),
    IMAGE: Symbol.for("CreateDallECommand"),
    LIST: Symbol.for("ListMessagesCommand"),
    OPEN: Symbol.for("OpenMessagesCommand"),
    READPDF: Symbol.for("ReadPdfCommand"),
    SAVE: Symbol.for("SaveMessagesCommand"),
    SAVEPAGE: Symbol.for("SaveWebpageCommand"),
    SAVECODE: Symbol.for("SaveCodeCommand"),
    SETSYSTEM: Symbol.for("SetSystemMessageCommand"),
    GenerateCodeCommand: Symbol.for("GenerateCodeCommand"),
    GenerateChatCommand: Symbol.for("GenerateChatCommand"),
    SaveMessagesCommand: Symbol.for("SaveMessagesCommand"),
  } as CommandSymbols,
  Configuration: Symbol.for("Configuration"),
  SystemInformation: Symbol.for("SystemInformation"),
  ICommandStrategy: Symbol.for("ICommandStrategy"),
  SearchHandler: Symbol.for("ISearch"),
  Handler: Symbol.for("IHandler"),
  AiClient: Symbol.for("IAiClient"),
  MessageClient: Symbol.for("MessageClient")
};

export { TYPES, ISearch, ICommandStrategy };

type CommandSymbols = {
  [key: string]: symbol;
};

export function extractCommandLabels(): string[] {
  return Object.keys(TYPES.Command);
}

export interface IHandler {
  handle(prompt: string, messages:  IMessage[]): Promise<boolean | undefined>;
}

export interface IMessageHandler {
  save(conversation: Conversation): Promise<void>;
  load(name: string): Promise<Conversation | null>;
}

export interface IConfig {
  [key: string]: any;
}

export interface IMessage {
  role: string;
  content: string;
}

export interface IAIClient {
  complete(messages: IMessage[]): Promise<string>;
  chat(messages: IMessage[]): Promise<string>;
  embed(inputText: string): Promise<number[]>;
  generateImage(prompt: string): Promise<string[]>
}

export interface ParsedPrompt {
  command: string;
  args: string[];
  argText: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  imageUrl?: string;
}
