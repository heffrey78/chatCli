import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { inject } from "inversify";
import {} from "inversify/lib/constants/metadata_keys";
import { TYPES, ConversationRepository } from "../../types";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { ConversationService } from "../../services/conversation/conversationService";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "ImportConversationCommand",
  description: "Imports a conversation from json to the database",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is the name of the json file to import"
    }
  },
  required: ["args"],
})
export class ImportConversationCommand implements ICommandStrategy {
  configuration: IConfiguration;
  repositoryFactory: (named: string) => ConversationRepository;
  conversationService: ConversationService;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration,
    @inject("Factory<ConversationRepository>")
    factory: (named: string) => ConversationRepository,
    @inject(TYPES.Services.ConversationService)
    conversationService: ConversationService
  ) {
    this.configuration = configuration;
    this.repositoryFactory = factory;
    this.conversationService = conversationService;
  }

  async execute(args: string[]): Promise<boolean> {
    const jsonHandlerName = "json";
    let jsonHandler = this.repositoryFactory(jsonHandlerName);
    let retrievedConversation = await jsonHandler.load(args[0]);

    if (retrievedConversation) {
      this.conversationService.apply(retrievedConversation);
      await this.conversationService.save(args[0]);
      console.log(`Imported messages from ${args[0]}`);
    }

    return false;
  }
}
