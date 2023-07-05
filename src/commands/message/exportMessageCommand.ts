import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, IMessage, ConversationHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";

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

  async execute(args: string[], messages: IMessage[]): Promise<boolean> {
    const jsonHandlerName = "json";
    const postgresHandlerName = "postgres";
    let jsonHandler = this.handlerFactory(jsonHandlerName);
    let postgresHandler = this.handlerFactory(postgresHandlerName);
    let conversation = await postgresHandler.load(args[0]);

    if(conversation?.messages !== undefined){
      conversation?.messages.forEach((message: IMessage) => {
        messages.push({ role: message.role, content: message.content });
      });

     await jsonHandler.save(conversation);

      console.log(`Exported messages from ${args[0]}`);
    }

    return false;
  }
}
