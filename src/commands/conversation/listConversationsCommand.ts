import { inject, injectable } from "inversify";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { ConversationRepository, ICommandStrategy, TYPES } from "../../types";

@injectable()
export class ListConversationsCommand implements ICommandStrategy {
    @inject(TYPES.Configuration) private configuration: IConfiguration;
    private conversationRepository: ConversationRepository;
    
    public constructor(
      @inject(TYPES.Configuration) configuration: IConfiguration,
      @inject("Factory<ConversationRepository>") repositoryFactory: (named: string) => ConversationRepository
    ) {
      this.configuration = configuration;
      this.conversationRepository = repositoryFactory("postgres");
    }

    async execute(args: string[]): Promise<boolean> {
        const list = await this.conversationRepository.list();
        console.log("Conversations: ");
        list?.forEach((item) => {
            console.log(item);
        });
        
        return false;
    }
}
