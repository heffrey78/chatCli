import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, IMessage, ConversationHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { Conversation, Message } from "../../db";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {  
  configuration: IConfiguration;
  handlerFactory: (named: string) => ConversationHandler;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration,
    @inject("Factory<ConversationHandler>") factory: (named: string) => ConversationHandler
  ) {
    this.configuration = configuration;
    this.handlerFactory = factory;
  }
  
  async execute(args: string[], iMessages: IMessage[]): Promise<boolean> {
    const handlerName = "postgres";
    let handler = this.handlerFactory(handlerName);

    let conversation = new Conversation({name: args[0]});

    let messages: Message[] = [];
    iMessages.forEach(async (imessage) => {
      let  message = new Message();
      message.role = imessage.role;
      message.content = imessage.content;
      messages.push(message);
    });

    conversation.messages = messages;

    await handler.save(conversation);

    console.log(`${args} saved`);
    return false;
  }
}