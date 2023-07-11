import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, ConversationHandler } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { Conversation, Message } from "../../db";

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

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    let retreievedConversation = await this.handlerFactory("postgres").load(args[0]);

    if(retreievedConversation) {
      conversation.id = retreievedConversation.id;
      conversation.name = retreievedConversation.name;
      conversation.createdAt = retreievedConversation.createdAt;
      conversation.updatedAt = retreievedConversation.updatedAt;
      let messages: Message[] = [];

      retreievedConversation.messages?.forEach((retrievedMessage) => {
        let message: Message = new Message();
        message.id = retrievedMessage.id;
        message.role = retrievedMessage.role;
        message.content = retrievedMessage.content;
        message.conversationId = retrievedMessage.conversationId;
        message.createdAt = retrievedMessage.createdAt;
        message.updatedAt = retrievedMessage.updatedAt;
        messages.push(message);
      });

      conversation.messages = messages;
      console.log(`Loaded messages from ${conversation.name}`);
    }

    return false;
  }
}
