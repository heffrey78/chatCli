import { injectable } from "inversify";
import { Conversation } from "../../database/entities/Conversation";
import { IMessage, IMessageHandler } from "../../types";
import { readMessagesFromFile, saveMessagesToFile } from "../../services/file/fileManager";
import { Message } from "../../database/entities/Message";

@injectable()
export class JsonMessageHandler implements IMessageHandler {
  async save(conversation: Conversation): Promise<void> {
    let iMessages: IMessage[] = [];

    if(conversation.messages !== undefined){
        conversation.messages.forEach((message) => {
            iMessages.push({role: message.role, content: message.content});
        })
    }
    
    await saveMessagesToFile(conversation.name, iMessages);
  }

  async load(name: string): Promise<Conversation | null> {
    let conversation: Conversation = new Conversation();
    conversation.name = name;
    let messages: Message[] = [];

    const readMessages = await readMessagesFromFile(name);

    readMessages.forEach((imessage: IMessage) => {
        let message: Message = new Message();
        message.role = imessage.role;
        message.content = imessage.content;
        messages.push(message);
    });

    conversation.messages = messages;

    return conversation;
  }
}
