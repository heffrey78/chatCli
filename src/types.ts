import { Conversation } from "./db";
import { ICommandStrategy } from "./interfaces/ICommandStrategy";
import { ISearch } from "./interfaces/web/ISearch";

const TYPES = {
  Command: {
    CALENDAR: Symbol.for("GoogleCalendarCommand"),
    CLEAR: Symbol.for("ClearMessagesCommand"),
    CONFIG: Symbol.for("SaveConfigCommand"),
    EXECUTE: Symbol.for("ExecuteShellCommand"),
    EXPORT: Symbol.for("ExportMessageCommand"),
    GETDIR: Symbol.for("AddDirectoryCommand"),
    GETEMBEDDING: Symbol.for("GetEmbeddingCommand"),
    GOOGLE: Symbol.for("GoogleSearchCommand"),
    IMAGE: Symbol.for("CreateDallECommand"),
    IMPORT: Symbol.for("ImportMessageCommand"),
    JIRA: Symbol.for("JiraQueryCommand"),
    LIST: Symbol.for("ListMessagesCommand"),
    CONVERSATIONS: Symbol.for("ListConversationsCommand"),
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

export interface Handler {
  handle(prompt: string, conversation: Conversation): Promise<boolean | undefined>;
}

export interface ConversationHandler {
  save(conversation: Conversation): Promise<void>;
  load(name: string): Promise<Conversation | null>;
  list(): Promise<string[] | undefined>;
}

export interface IConfig {
  [key: string]: any;
}

export interface Step {
  completion: boolean;
  description: string;
}

export interface IAIClient {
  complete(conversation: Conversation): Promise<string>;
  chat(conversation: Conversation): Promise<string>;
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

export interface DirectoryEntry {
  name: string;
  children?: DirectoryEntry[];
}
