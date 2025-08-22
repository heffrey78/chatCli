import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import { TYPES, ConversationRepository } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "ExportConversationCommand",
  description: "Exports a conversation from the database to json",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the name of the conversation used for the db lookup and file save"
    }
  },
  required: ["args"],
})
export class ExportConversationCommand implements ICommandStrategy {
  @inject("Factory<ConversationRepository>") private repositoryFactory: (named: string) => ConversationRepository;
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  public constructor(
    @inject("Factory<ConversationRepository>") factory: (named: string) => ConversationRepository,
    @inject(TYPES.Services.ConversationService) conversationService: ConversationService
  ) {
    this.repositoryFactory = factory;
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    let retrievedConversation = await this.conversationService.load(args[0]);

    if(retrievedConversation){
      const jsonHandlerName = "json";
      let jsonHandler = this.repositoryFactory(jsonHandlerName);
      await jsonHandler.save(retrievedConversation);
      console.log(`Exported messages from ${args[0]}`);
    }
       
    return false;
  }
}
