import { injectable } from "inversify";
import { ConversationRepository } from "../../types";
import { Conversation, Message } from "../../db";
import { ConversationDto } from "../../dtos/ConversationDto";
import { MessageDto } from "../../dtos/MessageDto";

@injectable()
export class ConversationPostgresRepository implements ConversationRepository {

  async save(conversation: ConversationDto): Promise<void> {
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
      await this.saveMessages(conversation.messages, id);
    }
  }

  async saveMessages(
    messages: MessageDto[],
    conversationId: number
  ): Promise<void> {
    const existingMessages = await Message.findAll({
      where: {
        conversationId: conversationId,
      },
    });

    const existingMessageIds = existingMessages.map((message) => message.id);
    const retainedMessageIds = messages
      .filter((message) => message.id !== undefined)
      .map((message) => message.id);

    const messagesToDelete = existingMessages.filter(
      (message) => !retainedMessageIds.includes(message.id)
    );

    const messagesToSave = messages.filter(
      (message) => message.id === undefined
    );

    const messagesToUpdate = messages.filter(
      (message) => message.id !== undefined && existingMessageIds.includes(message.id)
    );

    await Promise.all(
      messagesToDelete.map((message) => message.destroy())
    );

    await Promise.all(
      messagesToSave.map((message) =>
        Message.create({
          role: message.role,
          content: message.content,
          conversationId: conversationId,
        })
      )
    );

    await Promise.all(
      messagesToUpdate.map((message) =>
        Message.update(
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
        )
      )
    );
  }

  async load(name: string): Promise<ConversationDto> {
    const conversation = await Conversation.findOne({
      where: { name },
      include: [{ model: Message, as: "messages" }],
      order: [[{ model: Message, as: "messages" }, "id", "ASC"]],
    });

    if(conversation === null){
      throw new Error("Conversation not found");
    }

    let conversationDto: ConversationDto = new ConversationDto();
    conversationDto.id = conversation.id;
    conversationDto.name = conversation.name;
    let messages: MessageDto[] = [];

    conversation.messages?.forEach((foundMessage) => {
      let message: MessageDto = {
        id: foundMessage.id,
        role: foundMessage.role,
        content: foundMessage.content,
        conversationId: foundMessage.conversationId,
      };
      messages.push(message);
    });

    conversationDto.messages = messages;
    
    return conversationDto;
  }

  async list(): Promise<string[]> {
    const conversations = await Conversation.findAll();
    return conversations.map((conversation) => conversation.name);
  }
}
