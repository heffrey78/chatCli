import { inject, injectable } from "inversify";
import {
  IConversation,
  TYPES,
  ConversationRepository
} from "../../types";
import { MessageDto } from "../../dtos/MessageDto";
import { ConversationDto } from "../../dtos/ConversationDto";

@injectable()
export class ConversationService {
  @inject(TYPES.IConversation) private conversation: IConversation;
  private conversationRepository: ConversationRepository;

  constructor(
    @inject(TYPES.IConversation) conversation: IConversation,
    @inject("Factory<ConversationRepository>") factory: (named: string) => ConversationRepository
  ) {
    this.conversation = conversation;
    this.conversationRepository = factory("postgres");
  }

  async apply(conversation: IConversation) {
    this.conversation.id = conversation.id;
    this.conversation.name = conversation.name;
    this.conversation.messages = conversation.messages;
  }

  get(): IConversation {
    return this.conversation
  }

  getMessage(index: number): MessageDto | undefined {
    return this.conversation.messages?.at(index);
  }

  async load(name: string): Promise<IConversation> {
    let foundConversation = await this.conversationRepository.load(name);

    this.conversation.id = foundConversation.id;
    this.conversation.name = foundConversation.name;
    let messages: MessageDto[] = [];

    foundConversation.messages?.forEach((foundMessage) => {
      let message: MessageDto = {
        id: foundMessage.id,
        role: foundMessage.role,
        content: foundMessage.content,
        conversationId: foundMessage.conversationId,
      };
      messages.push(message);
    });

    this.conversation.messages = messages;

    return this.conversation;
  }

  async save(name: string): Promise<void> {
    this.conversation.name = name;
    await this.conversationRepository.save(this.conversation);
  }

  addMessage(role: string, content: string) {
    let message = new MessageDto();
    message.role = role;
    message.content = content;
    message.conversationId = this.conversation.id;
    this.conversation.messages.push(message);
  }

  setSystemMessage(systemMessage: string) {
    const messageIndex = this.conversation.messages?.findIndex(
      (message) => message.role === "system"
    );

    if (messageIndex !== undefined && messageIndex !== -1) {
      let message = this.conversation.messages?.at(messageIndex);

      if (message) {
        message.content = systemMessage;
      }
    } else {
      this.addMessage("system", systemMessage);
    }
  }

  listMessages(): void {
    let counter: number = 0;

    this.conversation.messages?.forEach((message: MessageDto) => {
      console.log(
        `Index: ${counter}, Id: ${message.id}, Role: ${
          message.role
        } \n Content: ${JSON.stringify(message.content)}`
      );
      counter++;
    });
  }

  clear(): void {
    this.conversation = new ConversationDto();
    this.conversation.messages = [];
  }

  remove(index: number) {
    this.conversation.messages.splice(index, 1);
  }
}
