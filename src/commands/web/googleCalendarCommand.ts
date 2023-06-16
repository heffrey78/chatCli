import { injectable } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { authorize, listEvents } from "../../services/web/google/calendar";
import { IMessage } from "../../types";

@injectable()
export class GoogleCalendarCommand implements ICommandStrategy {
  async execute(args: string[], messages: any[]): Promise<boolean> {
    const auth = await authorize();
    const result = await listEvents(auth);

    let message: IMessage = {
      role: "user",
      content: JSON.stringify(result),
    };
    messages.push(message);
    return false;
  }
}
