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
  Handler: Symbol.for("IHandler")
};

export { TYPES, ISearch, ICommandStrategy };

type CommandSymbols = {
  [key: string]: symbol;
};

export function extractCommandLabels(): string[] {
  return Object.keys(TYPES.Command);
}

export interface IHandler {
  handle( prompt: string, messages:  IMessage[]): Promise<boolean | undefined>;
}

export interface IConfig {
  [key: string]: any;
}

export interface IMessage {
  role: string;
  content: string;
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

export interface ITextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}
