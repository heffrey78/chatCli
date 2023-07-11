import { injectable } from "inversify";
import { Conversation, Message } from "../../db";
import { ConversationHandler } from "../../types";
import {
  readMessagesFromFile,
  saveMessagesToFile,
  listFilesInDirectory,
} from "../file/fileManager";


@injectable()
export class JsonConversationHandler implements ConversationHandler {
  async save(conversation: Conversation): Promise<void> {
    await saveMessagesToFile(conversation.name, conversation.messages);
  }

  async load(name: string): Promise<Conversation | null> {
    let conversation: Conversation = new Conversation();
    conversation.name = name;
    let messages: Message[] = [];

    const readMessages = await readMessagesFromFile(name);

    readMessages.forEach((readMessage: Message) => {
      let message: Message = new Message();
      message.role = readMessage.role;
      message.content = readMessage.content;
      messages.push(message);
    });

    conversation.messages = messages;

    return conversation;
  }

  async list(): Promise<string[] | undefined> {
    return await listFilesInDirectory("messages");
  }
}
