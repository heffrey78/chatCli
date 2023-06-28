import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, IMessage, ConversationHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";

@injectable()
export class OpenMessagesCommand implements ICommandStrategy {
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
    let handlerName = this.configuration.postgres ? "postgres" : "json";
    let handler = this.handlerFactory(handlerName);

    let conversation = await handler.load(args[0]);

    if(conversation?.messages !== undefined){
      conversation?.messages.forEach((message: IMessage) => {
        messages.push({ role: message.role, content: message.content });
      });

      console.log(`Loaded messages from ${args[0]}`);
    }

    return false;
  }
}
