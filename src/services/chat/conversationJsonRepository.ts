import { injectable } from "inversify";
import { ConversationRepository, IMessage } from "../../types";
import {
  readMessagesFromFile,
  saveMessagesToFile,
  listFilesInDirectory,
} from "../file/fileManager";
import { ConversationDto } from "../../dtos/ConversationDto";
import { MessageDto } from "../../dtos/MessageDto";


@injectable()
export class ConversationJsonRepository implements ConversationRepository {

  async save(conversation: ConversationDto): Promise<void> {
    await saveMessagesToFile(conversation.name, conversation.messages);
  }

  async load(name: string): Promise<ConversationDto> {
    let conversation: ConversationDto = new ConversationDto();
    conversation.name = name;
    conversation.messages = [];

    const readMessages = await readMessagesFromFile(name);

    readMessages.forEach((readMessage: IMessage) => {
      let message: MessageDto = new MessageDto();
      message.role = readMessage.role;
      message.content = readMessage.content;
      conversation.messages?.push(message);
    });

    return conversation;
  }

  async list(): Promise<string[]> {
    return await listFilesInDirectory("messages");
  }
}