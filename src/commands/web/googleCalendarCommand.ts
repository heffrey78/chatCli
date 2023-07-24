import { inject } from "inversify";
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { authorize, listEvents } from "../../services/web/google/calendar";
import { ConversationService } from "../../services/conversation/conversationService";
import { TYPES } from "../../types";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "GoogleCalendarCommand",
  description: "Retrieves a list of events from the associated Google Calendar",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args is unused"
    }
  },
  required: ["args"],
})
export class GoogleCalendarCommand implements ICommandStrategy {
  @inject(TYPES.Services.ConversationService)
  private conversationService: ConversationService;

  constructor(
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.conversationService = conversationService;
  }
  
  async execute(args: string[]): Promise<boolean> {
    const auth = await authorize();
    const result = await listEvents(auth);
    this.conversationService.addMessage("user", JSON.stringify(result));  

    return false;
  }
}
