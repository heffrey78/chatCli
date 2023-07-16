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
import { ClearConversationCommand } from "./commands/conversation/clearConversationCommand";
import { ListMessagesCommand } from "./commands/conversation/listMessagesCommand";
import { OpenMessagesCommand } from "./commands/conversation/openConversationCommand";
import { SaveMessagesCommand } from "./commands/conversation/saveConversationCommand";
import { ExecuteShellCommand } from "./commands/system/shell/executeShellCommand";
import { GoogleSearchCommand } from "./commands/web/googleSearchCommand";
import { SaveWebpageCommand } from "./commands/web/saveWebpageCommand";
import { Configuration } from "./config/Configuration";
import { IConfiguration } from "./interfaces/IConfiguration";
import { ISystemInformation } from "./interfaces/system/ISystemInformation";
import { Google as GoogleSearch } from "./services/web/google";
import { SystemInformation } from "./services/system/SystemInformation";
import {
  TYPES,
  ICommandStrategy,
  ISearch,
  IAIClient,
  ConversationRepository,
  IConversation,
  IContext,
} from "./types";
import { GoogleCalendarCommand } from "./commands/web/googleCalendarCommand";
import { SetSystemMessageCommand } from "./commands/conversation/setSystemMessageCommand";
import { ChatHandler } from "./chatHandler";
import { OpenAiClient } from "./services/openai/openAiClient";
import { ConversationPostgresRepository } from "./services/chat/conversationPostgresRepository";
import { ConversationJsonRepository } from "./services/chat/conversationJsonRepository";
import { ListConversationsCommand } from "./commands/conversation/listConversationsCommand";
import { ImportConversationCommand } from "./commands/conversation/importConversationCommand";
import { ExportConversationCommand } from "./commands/conversation/exportConversationCommand";
import { JiraQueryCommand } from "./commands/web/jiraQueryCommand";
import { ConversationDto } from "./dtos/ConversationDto";
import { ContextDto } from "./dtos/ContextDto";
import { ConversationService } from "./services/conversation/conversationService";

const container = new Container();

container
  .bind<ConversationRepository>("ConversationRepository")
  .to(ConversationPostgresRepository)
  .whenTargetNamed("postgres");

container
  .bind<ConversationRepository>("ConversationRepository")
  .to(ConversationJsonRepository)
  .whenTargetNamed("json");

container
  .bind<interfaces.Factory<ConversationRepository>>(
    "Factory<ConversationRepository>"
  )
  .toFactory<ConversationRepository, [string]>(
    (context: interfaces.Context) => {
      return (named: string) => {
        return context.container.getNamed<ConversationRepository>(
          "ConversationRepository",
          named
        );
      };
    }
  );

container
  .bind<IConfiguration>(TYPES.Configuration)
  .to(Configuration)
  .inSingletonScope();
container
  .bind<ISystemInformation>(TYPES.SystemInformation)
  .to(SystemInformation)
  .inSingletonScope();
container
  .bind<ISearch>(TYPES.SearchHandler)
  .to(GoogleSearch)
  .inSingletonScope();
container.bind<IAIClient>(TYPES.AiClient).to(OpenAiClient).inSingletonScope();
container
  .bind<IConversation>(TYPES.IConversation)
  .to(ConversationDto)
  .inSingletonScope();
container.bind<IContext>(TYPES.IContext).to(ContextDto).inSingletonScope();

container
  .bind<ICommandStrategy>(TYPES.Command.ChatHandler)
  .to(ChatHandler)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.CALENDAR)
  .to(GoogleCalendarCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.CLEAR)
  .to(ClearConversationCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.CONFIG)
  .to(SaveConfigCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.EXECUTE)
  .to(ExecuteShellCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.EXPORT)
  .to(ExportConversationCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.GETDIR)
  .to(AddDirectoryCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.GETEMBEDDING)
  .to(GetEmbeddingCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.GOOGLE)
  .to(GoogleSearchCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.IMPORT)
  .to(ImportConversationCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.JIRA)
  .to(JiraQueryCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.LIST)
  .to(ListMessagesCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.CONVERSATIONS)
  .to(ListConversationsCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.OPEN)
  .to(OpenMessagesCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.READPDF)
  .to(ReadPdfCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.SAVE)
  .to(SaveMessagesCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.SAVECODE)
  .to(SaveCodeCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.SAVEPAGE)
  .to(SaveWebpageCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.SETSYSTEM)
  .to(SetSystemMessageCommand)
  .inSingletonScope();

container
  .bind<ICommandStrategy>(TYPES.Command.IMAGE)
  .to(CreateDallECommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.GenerateCodeCommand)
  .to(GenerateCodeCommand)
  .inSingletonScope();
container
  .bind<ICommandStrategy>(TYPES.Command.GenerateChatCommand)
  .to(GenerateChatCommand)
  .inSingletonScope();

container
  .bind<ConversationService>(TYPES.Services.ConversationService)
  .to(ConversationService)
  .inSingletonScope();

export { container };
