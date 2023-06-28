import { inject, injectable } from "inversify";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { ConversationHandler, ICommandStrategy, IMessage, TYPES } from "../../types";

@injectable()
export class ListConversationsCommand implements ICommandStrategy {
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
        const list = await handler.list();
        console.log("Conversations: ");
        list?.forEach((item) => {
            console.log(item);
        });
        
        return false;
    }
}
