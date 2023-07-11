import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { authorize, listEvents } from "../../services/web/google/calendar";
import { Conversation, Message } from "../../db";

@injectable()
export class GoogleCalendarCommand implements ICommandStrategy {
  async execute(args: string[], conversation: Conversation): Promise<boolean> {
    const auth = await authorize();
    const result = await listEvents(auth);

    let message: Message = new Message();
    message.role = "user";
    message.content = JSON.stringify(result);    
    conversation.messages?.push(message);   

    return false;
  }
}
