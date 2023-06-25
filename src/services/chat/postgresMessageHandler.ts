import { injectable } from "inversify";
import { Conversation } from "../../database/entities/Conversation";
import { IMessageHandler } from "../../types";
import { AppDataSource } from "../../data-source";

@injectable()
export class PostgresMessageHandler implements IMessageHandler {
  async save(conversation: Conversation): Promise<void> {
    const repo = AppDataSource.getRepository("Conversation");
    await repo.save(conversation);

    if (conversation.messages !== undefined) {
      conversation.messages.forEach(async (message) => {
        await AppDataSource.manager.save(message);
      });
    }
  }

  async load(name: string): Promise<Conversation | null> {
    const conversation = await AppDataSource.getRepository(Conversation)
    .createQueryBuilder("conversation")
    .leftJoinAndSelect("conversation.messages", "message")
    .where("conversation.name = :name")
    .setParameters({name: name})
    .getOne();

    return conversation;
  }
}
