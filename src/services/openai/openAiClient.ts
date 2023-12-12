import { injectable, inject } from "inversify";
import { OpenAI } from "openai";
import { ChatCompletionMessage, ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';
import { Configuration } from "../../config/Configuration";
import { TYPES, IAIClient, IConversation } from "../../types";
import extractAndWriteCodeToFile from "../code/codeManager";


@injectable()
class OpenAiClient implements IAIClient {
  @inject(TYPES.Configuration) private configuration: Configuration;
  private openAiApiClient: OpenAI;
  private outputDirectory: string = "./output/";

  public constructor(
    @inject(TYPES.Configuration) configuration: Configuration
  ) {
    this.configuration = configuration;
    this.openAiApiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat(conversation: IConversation): Promise<string> {
    return await this.generateChatCompletion(conversation);
  }

  async complete(conversation: IConversation): Promise<string> {
    try {
      const response = await this.generateChatCompletion(conversation);
      await extractAndWriteCodeToFile(response, this.outputDirectory);

      return response;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      return "An error occurred. Please try again.";
    }
  }

  async embed(inputText: string): Promise<number[]> {
    const embeddingResponse = await this.openAiApiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: inputText,
    });

    return embeddingResponse.data[0].embedding;
  }

  async generateImage(prompt: string): Promise<string[]> {
    const response = await this.openAiApiClient.images.generate({
      prompt: prompt,
      n: 2,
      size: "1024x1024",
    });

    if (response.data && response.data && response.data.length > 0) {
      let urls: string[] = [];

      response.data.forEach((data) => {
        if (data.url === undefined) {
          throw "No image data";
        }
        urls.push(data.url);
      });

      return urls;
    } else {
      throw new Error("No data available in the response");
    }
  }

  private async generateChatCompletion(conversation: IConversation): Promise<string> {
    try {
      const request = this.getDefaultCompletionRequest(conversation);

      const completion = await this.openAiApiClient.chat.completions.create(
        request
      );

      if (
        completion === undefined ||
        completion.choices.length === 0 ||
        completion.choices[0].message === undefined ||
        completion.choices[0].message.content === undefined
      ) {
        throw "No response";
      }

      const response: string = completion.choices[0].message.content ?? "";

      return response;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      return "An error occurred. Please try again.";
    }
  }


  private getDefaultCompletionRequest(conversation: IConversation): ChatCompletionCreateParamsNonStreaming {
    return this.getCompletionRequest(conversation, this.configuration.model);
  }

  private getCompletionRequest(conversation: IConversation, model: string): ChatCompletionCreateParamsNonStreaming {
    let requestMessages: ChatCompletionMessage[] = [];
    if (conversation.messages) {
      conversation.messages.forEach((message) => {
        requestMessages.push({ role: 'assistant', content: message.content });
      });

      const request: ChatCompletionCreateParamsNonStreaming = {
        model: model,
        messages: requestMessages,
      };
      return request;
    } else {
      throw new Error("Conversation is null.");
    }
  }
}

export { OpenAiClient };
