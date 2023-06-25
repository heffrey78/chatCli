import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { Conversation } from "../../database/entities/Conversation";
import { Message } from "../../database/entities/Message";
import { TYPES, IMessage, IMessageHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {  
  configuration: IConfiguration;
  handlerFactory: (named: string) => IMessageHandler;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration,
    @inject("Factory<IMessageHandler>") factory: (named: string) => IMessageHandler
  ) {
    this.configuration = configuration;
    this.handlerFactory = factory;
  }
  
  async execute(args: string[], iMessages: IMessage[]): Promise<boolean> {
    let handlerName = this.configuration.postgres ? "postgres" : "json";
    let handler = this.handlerFactory(handlerName);

    let conversation = new Conversation();
    conversation.name = args[0];

    let messages: Message[] = [];
    iMessages.forEach(async (imessage) => {
      let  message = new Message();
      message.role = imessage.role;
      message.content = imessage.content;
      message.conversation = conversation;
      messages.push(message);
    });

    conversation.messages = messages;

    await handler.save(conversation);

    console.log(`${args} saved`);
    return false;
  }
}