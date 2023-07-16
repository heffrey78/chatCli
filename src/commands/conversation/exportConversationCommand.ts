import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject, injectable } from "inversify";
import { TYPES, ConversationRepository } from "../../types";
import { ConversationService } from "../../services/conversation/conversationService";

@injectable()
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
