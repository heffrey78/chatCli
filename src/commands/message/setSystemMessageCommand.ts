import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { Conversation, Message } from "../../db";

@injectable()
export class SetSystemMessageCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const messageIndex = conversation.messages?.findIndex(
      (message) => message.role === "system"
    );

    if (messageIndex !== undefined && messageIndex !== -1) {
      let message = conversation.messages?.at(messageIndex);

      if (message) {
        message.role = "system";
        message.content = args[0];
        await Message.update(
          { role: "system", content: args[0] },
          { where: { id: messageIndex } }
        );
      }       
    } else {
      this.addSystemMessage(conversation, args[0]);
    }

    return false;
  }

  addSystemMessage(
    conversation: Conversation,
    systemMessage: string
  ): void {
    let message: Message = new Message();
    message.role = "system";
    message.content = systemMessage;
    message.conversationId = conversation.id;

    if(!conversation.messages) {
      conversation.messages = [];
      conversation.messages.push(message);
    } else {
      conversation.messages?.unshift(message);
    }
  }
}
