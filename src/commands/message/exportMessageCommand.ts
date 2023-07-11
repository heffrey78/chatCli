import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, ConversationHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { Conversation } from "../../db";

@injectable()
export class ExportMessagesCommand implements ICommandStrategy {
  configuration: IConfiguration;
  handlerFactory: (named: string) => ConversationHandler;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration,
    @inject("Factory<ConversationHandler>") factory: (named: string) => ConversationHandler
  ) {
    this.configuration = configuration;
    this.handlerFactory = factory;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const jsonHandlerName = "json";
    const postgresHandlerName = "postgres";
    let jsonHandler = this.handlerFactory(jsonHandlerName);
    let postgresHandler = this.handlerFactory(postgresHandlerName);
    let retrievedConversation = await postgresHandler.load(args[0]);

    if(retrievedConversation){
      await jsonHandler.save(retrievedConversation);
      conversation = retrievedConversation;
      console.log(`Exported messages from ${args[0]}`);
    }
       
    return false;
  }
}
