import { injectable } from "inversify";
import { ConversationHandler } from "../../types";
import { Conversation, Message } from "../../db";

@injectable()
export class PostgresConversationHandler implements ConversationHandler {
  async save(conversation: Conversation): Promise<void> {
    let retrievedConversation = await Conversation.findOne({
      where: { name: conversation.name },
    });

    if (retrievedConversation === null) {
      retrievedConversation = await Conversation.create({
        name: conversation.name,
      });
    } else {
      await Conversation.update(
        { name: retrievedConversation.name },
        {
          where: { id: retrievedConversation.id },
          returning: true,
        }
      );
    }

    let id: number;
    if (retrievedConversation.id !== undefined) {
      id = retrievedConversation.id;
    } else {
      throw new Error("Conversation id cannot be null.");
    }

    if (conversation.messages !== undefined) {
      conversation.messages.forEach(async (message) => {
        if (!message.id || message.id === null) {
          await Message.create({
            role: message.role,
            content: message.content,
            conversationId: id,
          });
        } else {
          await Message.update(
            {
              role: message.role,
              content: message.content,
              conversationId: message.conversationId,
            },
            {
              where: {
                id: message.id,
              },
              returning: true,
            }
          );
        }
      });
    }

    conversation = await this.load(conversation.name);
  }

  async load(name: string): Promise<Conversation> {
    const conversation = await Conversation.findOne({
      where: { name },
      include: [{ model: Message, as: "messages" }],
    });

    if(conversation === null){
      throw new Error("Conversation not found");
    }

    return conversation;
  }

  async list(): Promise<string[]> {
    const conversations = await Conversation.findAll();
    return conversations.map((conversation) => conversation.name);
  }
}
