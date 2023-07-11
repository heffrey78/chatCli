import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { Conversation, Message } from "../../db";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {
  configuration: IConfiguration;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration) {
    this.configuration = configuration;
  }

  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    let savedConversation: Conversation;

    if (!conversation.name || conversation.name !== args[0]) {
      savedConversation = await Conversation.create({ name: args[0] });
    } else {
      savedConversation = conversation;
    }

    conversation.messages?.forEach(async (message) => {
      if(!message.id) {
        await Message.create({
          role: message.role,
          content: message.content,
          conversationId: savedConversation.id,
        });
      } else {
        await Message.update({ 
          role: message.role, 
          content: message.content, 
          conversationId: message.conversationId
        }, { 
          where: { 
            id: message.id
          },
          returning: true});
      }
    });

    console.log(`${args} saved`);
    return false;
  }
}
