import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { saveMessagesToFile } from "../../services/file/fileManager";
import { injectable } from "inversify";
import { AppDataSource } from "../../data-source";
import { Conversation } from "../../database/entities/Conversation";
import { Message } from "../../database/entities/Message";
import { IMessage } from "../../types";

@injectable()
export class SaveMessagesCommand implements ICommandStrategy {  
  async execute(args: string[], iMessages: IMessage[]): Promise<boolean> {
    let conversation = new Conversation();
    conversation.name = args[0];
    const repo = AppDataSource.getRepository("Conversation");
    await repo.save(conversation);

    let messages: Message[] = [];
    iMessages.forEach(async (imessage) => {
      let  message = new Message();
      message.role = imessage.role;
      message.content = imessage.content;
      message.conversation = conversation;
      await AppDataSource.manager.save(message);
      messages.push(message);
    });

    await saveMessagesToFile(args[0], iMessages);
    console.log(`${args} saved`);
    return false;
  }
}