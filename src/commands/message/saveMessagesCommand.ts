import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { ConversationHandler, TYPES } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { Conversation, Message } from "../../db";
import { error } from "console";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {
  configuration: IConfiguration;
  handlerFactory: (named: string) => ConversationHandler;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration,
    @inject("Factory<ConversationHandler>")
    factory: (named: string) => ConversationHandler) {
    this.configuration = configuration;
    this.handlerFactory = factory;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const postgresHandlerName = "postgres";
    let handler = this.handlerFactory(postgresHandlerName);
    await handler.save(conversation);

    console.log(`${args} saved`);
    return false;
  }
}
