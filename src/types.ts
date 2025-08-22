import { ConversationDto } from "./dtos/ConversationDto";
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
    HELP: Symbol.for("GetHelpCommand"),
    JIRA: Symbol.for("JiraQueryCommand"),
    LIST: Symbol.for("ListMessagesCommand"),
    CONVERSATIONS: Symbol.for("ListConversationsCommand"),
    OPEN: Symbol.for("OpenMessagesCommand"),
    READPDF: Symbol.for("ReadPdfCommand"),
    REMOVE: Symbol.for("RemoveMessageCommand"),
    SAVE: Symbol.for("SaveMessagesCommand"),
    SAVEPAGE: Symbol.for("SaveWebpageCommand"),
    SAVECODE: Symbol.for("SaveCodeCommand"),
    SETSYSTEM: Symbol.for("SetSystemMessageCommand"),
    GenerateCodeCommand: Symbol.for("GenerateCodeCommand"),
    GenerateChatCommand: Symbol.for("GenerateChatCommand"),
    SaveMessagesCommand: Symbol.for("SaveMessagesCommand"),
    ChatHandler: Symbol.for("ChatHandler")
  } as Symbols,
  Services: {
    ConversationService: Symbol.for("ConversationService")
  } as Symbols,
  Configuration: Symbol.for("Configuration"),
  SystemInformation: Symbol.for("SystemInformation"),
  ICommandStrategy: Symbol.for("ICommandStrategy"),
  SearchHandler: Symbol.for("ISearch"),
  AiClient: Symbol.for("IAiClient"),
  MessageClient: Symbol.for("MessageClient"),
  IConversation: Symbol.for("IConversation"),
  IContext: Symbol.for("IContext")
};

export { TYPES, ISearch, ICommandStrategy };

type Symbols = {
  [key: string]: symbol;
};

export function extractCommandLabels(): string[] {
  return Object.keys(TYPES.Command);
}

export interface ConversationRepository {
  save(conversation: ConversationDto): Promise<void>;
  load(name: string): Promise<ConversationDto>;
  list(): Promise<string[] | undefined>;
}

export interface IContext {
  conversation: IConversation;
}

export interface IConversation {
  id: number;
  name: string;
  messages: IMessage[];
}

export interface IMessage {
  id: number;
  role: string;
  content: string;
  conversationId: number;
}

export interface IWorkItem {
  id: number;
  description: string;
  parentWorkItemId: number;
  childWorkItemIds: number[];
  status: string;
  assignee: string;
  execution: string;
}

export interface IConfig {
  [key: string]: any;
}

export interface IAIClient {
  complete(conversation: IConversation): Promise<string>;
  chat(conversation: IConversation): Promise<string>;
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
