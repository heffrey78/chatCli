import { injectable, inject } from "inversify";
import {
  Configuration as OpenAiConfiguration,
  OpenAIApi,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessageRoleEnum,
} from "openai";
import { Configuration } from "../../config/Configuration";
import { TYPES, IMessage, IAIClient } from "../../types";
import extractAndWriteCodeToFile from "../code/codeManager";

@injectable()
class OpenAiClient implements IAIClient {
  @inject(TYPES.Configuration) private configuration: Configuration;
  private openAIConfiguration: OpenAiConfiguration;
  private openAiApiClient: OpenAIApi;
  private outputDirectory: string = "./output/";

  public constructor(
    @inject(TYPES.Configuration) configuration: Configuration
  ) {
    this.configuration = configuration;
    this.openAIConfiguration = new OpenAiConfiguration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApiClient = new OpenAIApi(this.openAIConfiguration);
  }

  async embed(inputText: string): Promise<number[]> {
    const embeddingResponse = await this.openAiApiClient.createEmbedding({
      model: "text-embedding-ada-002",
      input: inputText,
    });

    return embeddingResponse.data.data[0].embedding;
  }

  async chat(messages: IMessage[]): Promise<string> {
    return await this.generateChatCompletion(messages);
  }

  async complete(messages: IMessage[]): Promise<string> {
    try {
      const response = await this.generateChatCompletion(messages);
      await extractAndWriteCodeToFile(response, this.outputDirectory);

      return response;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      return "An error occurred. Please try again.";
    }
  }

  private async generateChatCompletion(messages: IMessage[]): Promise<string> {
    try {
      let requestMessages: ChatCompletionRequestMessage[] = [];

      messages.forEach((message) => {
        if (Object.values(ChatCompletionResponseMessageRoleEnum).findIndex((role) => role === message.role) !== -1) {
          const roleIndex = Object.values(ChatCompletionResponseMessageRoleEnum).findIndex(((role) => role === message.role));
          const role = Object.values(ChatCompletionResponseMessageRoleEnum)[roleIndex];
          requestMessages.push({ role: role, content: message.content });
        } else {
          throw "Incorrect role";
        }
      });


      const request: CreateChatCompletionRequest = {
        model: this.configuration.model,
        messages: requestMessages,
      };

      const completion = await this.openAiApiClient.createChatCompletion(
        request
      );

      if(completion.data === undefined || completion.data.choices.length === 0 || completion.data.choices[0].message === undefined) {
        throw "No response";
      }

      const response: string = completion.data.choices[0].message.content;

      return response;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      return "An error occurred. Please try again.";
    }
  }

  async generateImage(prompt: string): Promise<string[]> {
    const response = await this.openAiApiClient.createImage({
      prompt: prompt,
      n: 2,
      size: "1024x1024",
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      let urls: string[] = [];

      response.data.data.forEach((data) => {
        if(data.url === undefined) {
          throw "No image data";
        }
        urls.push(data.url);
      });

      return urls;
    } else {
      throw new Error("No data available in the response");
    }
  }
}

export { OpenAiClient };
