import { injectable } from "inversify";
import { ConversationHandler } from "../../types";
import { Conversation, Message } from "../../db";

@injectable()
export class PostgresConversationHandler implements ConversationHandler {
  async save(conversation: Conversation): Promise<void> {

    let retrievedConversation = await Conversation.findOne({where: {name: conversation.name}});

    if(retrievedConversation === null){
      conversation = await Conversation.create({ name: conversation.name });
    } else {
      await Conversation.update({ name: retrievedConversation.name }, 
      {
        where: { id: retrievedConversation.id }, 
        returning: true, 
      });
    }

    let id: number;
    if(conversation.id !== undefined) {
      id = conversation.id;
    } else {
      throw new Error("Conversation id cannot be null.");
    }

    if (conversation.messages !== undefined) {
      conversation.messages.forEach(async (message) => {
        if(!message.id){
          await Message.create({ 
            role: message.role, 
            content: message.content, 
            conversationId: id
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
    }
  }

  async load(name: string): Promise<Conversation | null> {
    const conversation = await Conversation.findOne({
      where: { name },
      include: [Message],
    });

    return conversation;
  }

  async list(): Promise<string[] | undefined> {
    const conversations = await Conversation.findAll();
    return conversations.map((conversation) => conversation.name);
  }
}
