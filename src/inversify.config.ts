import { Container, interfaces } from "inversify";
import "reflect-metadata";
import { GenerateChatCommand } from "./commands/chat/generateChatCommand";
import { GenerateCodeCommand } from "./commands/chat/generateCodeCommand";
import { GetEmbeddingCommand } from "./commands/chat/getEmbeddingCommand";
import { SaveCodeCommand } from "./commands/code/saveCodeCommand";
import { SaveConfigCommand } from "./commands/config/saveConfigCommand";
import { AddDirectoryCommand } from "./commands/file/addDirectoryCommand";
import { ReadPdfCommand } from "./commands/file/readPdfCommand";
import { CreateDallECommand } from "./commands/image/createDallECommand";
import { ClearMessagesCommand } from "./commands/message/clearMessagesCommand";
import { ListMessagesCommand } from "./commands/message/listMessagesCommand";
import { OpenMessagesCommand } from "./commands/message/openMessagesCommand";
import { SaveMessagesCommand } from "./commands/message/saveMessagesCommand";
import { ExecuteShellCommand } from "./commands/system/shell/executeShellCommand";
import { GoogleSearchCommand } from "./commands/web/googleSearchCommand";
import { SaveWebpageCommand } from "./commands/web/saveWebpageCommand";
import { Configuration } from "./config/Configuration";
import { IConfiguration } from "./interfaces/IConfiguration";
import { ISystemInformation } from "./interfaces/system/ISystemInformation";
import { Google as GoogleSearch } from "./services/web/google";
import { SystemInformation } from "./services/system/SystemInformation";
import { ICommandStrategy, ISearch, TYPES, Handler, IAIClient, ConversationHandler } from "./types";
import { GoogleCalendarCommand } from "./commands/web/googleCalendarCommand";
import { SetSystemMessageCommand } from "./commands/message/setSystemMessageCommand";
import { ChatHandler } from "./chatHandler";
import { OpenAiClient } from "./services/openai/openAiClient";
import { PostgresConversationHandler } from "./services/chat/postgresConversationHandler";
import { JsonConversationHandler } from "./services/chat/jsonConversationHandler";
import { ListConversationsCommand } from "./commands/message/listConversationsCommand";
import { ImportMessagesCommand } from "./commands/message/importMessageCommand";
import { ExportMessagesCommand } from "./commands/message/exportMessageCommand";
import { JiraQueryCommand } from "./commands/web/jiraQueryCommand";

const container = new Container();

container.bind<IConfiguration>(TYPES.Configuration).to(Configuration).inSingletonScope();
container.bind<ISystemInformation>(TYPES.SystemInformation).to(SystemInformation).inSingletonScope();
container.bind<ISearch>(TYPES.SearchHandler).to(GoogleSearch).inSingletonScope();
container.bind<Handler>(TYPES.Handler).to(ChatHandler).inSingletonScope();
container.bind<IAIClient>(TYPES.AiClient).to(OpenAiClient).inSingletonScope();

container.bind<ICommandStrategy>(TYPES.Command.CALENDAR).to(GoogleCalendarCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.CLEAR).to(ClearMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.CONFIG).to(SaveConfigCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.EXECUTE).to(ExecuteShellCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.EXPORT).to(ExportMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.GETDIR).to(AddDirectoryCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.GETEMBEDDING).to(GetEmbeddingCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.GOOGLE).to(GoogleSearchCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.IMPORT).to(ImportMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.JIRA).to(JiraQueryCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.LIST).to(ListMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.CONVERSATIONS).to(ListConversationsCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.OPEN).to(OpenMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.READPDF).to(ReadPdfCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.SAVE).to(SaveMessagesCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.SAVECODE).to(SaveCodeCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.SAVEPAGE).to(SaveWebpageCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.SETSYSTEM).to(SetSystemMessageCommand).inSingletonScope();

container.bind<ICommandStrategy>(TYPES.Command.IMAGE).to(CreateDallECommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.GenerateCodeCommand).to(GenerateCodeCommand).inSingletonScope();
container.bind<ICommandStrategy>(TYPES.Command.GenerateChatCommand).to(GenerateChatCommand).inSingletonScope();

container.bind<ConversationHandler>("ConversationHandler").to(PostgresConversationHandler).whenTargetNamed("postgres");
container.bind<ConversationHandler>("ConversationHandler").to(JsonConversationHandler).whenTargetNamed("json");

container.bind<interfaces.Factory<ConversationHandler>>("Factory<ConversationHandler>").toFactory<ConversationHandler,[string]>((context) => {
    return (named: string) => {
        return context.container.getNamed<ConversationHandler>("ConversationHandler", named);
    };
});

export { container };
