import { injectable, inject } from 'inversify';
import { TYPES } from "../../types";
import { OpenAiClient } from '../../services/openai/openAiClient';
import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { ConversationService } from '../../services/conversation/conversationService';
import { SystemInformation } from '../../services/system/SystemInformation';

@injectable()
export class GenerateCodeCommand implements ICommandStrategy {
  @inject(TYPES.SystemInformation) private systemInformation: SystemInformation;
  @inject(TYPES.AiClient) private aiClient: OpenAiClient;
  @inject(TYPES.Services.ConversationService) private conversationService: ConversationService;

  public constructor(
    @inject(TYPES.SystemInformation) systemInformation: SystemInformation,
    @inject(TYPES.AiClient) aiClient: OpenAiClient,
    @inject(TYPES.Services.ConversationService) conversationService: ConversationService
    ) {
      this.systemInformation = systemInformation;
    this.aiClient = aiClient;
    this.conversationService = conversationService
  }

  async execute(args: string[]): Promise<boolean> {
    const systemMessage = `Development should target a system with the following information: ${JSON.stringify(
      this.systemInformation
    )} \r\n Act as an expert in mentioned technologies. Use best practices. Create a directory structure, and use it to add a comment at the top of each file. The comment should only be an appropriate filename with no other information`;

    this.conversationService.setSystemMessage(systemMessage);

    this.conversationService.addMessage("user", args[0].replace(/[\r\n]/gm, ""));
    const response = await this.aiClient.complete(this.conversationService.get());
    this.conversationService.addMessage("assistant", response);
    console.log("Assistant:", response);

    return false;
  }
}
