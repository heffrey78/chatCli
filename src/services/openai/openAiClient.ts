import { injectable, inject } from "inversify";
import {
  Configuration as OpenAiConfiguration,
  OpenAIApi,
  CreateChatCompletionRequest,
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessageRoleEnum
} from "openai";
import { Configuration } from "../../config/Configuration";
import { TYPES, IAIClient, IConversation, IMessage } from "../../types";
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
    const embeddingResponse = await this.openAiApiClient.createEmbedding({
      model: "text-embedding-ada-002",
      input: inputText,
    });

    return embeddingResponse.data.data[0].embedding;
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

      const completion = await this.openAiApiClient.createChatCompletion(
        request
      );

      if (
        completion.data === undefined ||
        completion.data.choices.length === 0 ||
        completion.data.choices[0].message === undefined || 
        completion.data.choices[0].message.content === undefined
      ) {
        throw "No response";
      }

      const response: string = completion.data.choices[0].message.content;

      return response;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      return "An error occurred. Please try again.";
    }
  }

  async getFunction(functionInput: any, conversation: IConversation): Promise<string> {
    try {
      // Add the function input to the chat completion request
      const request = this.getCompletionRequest(conversation, "gpt-3.5-turbo");
      request.functions = [functionInput];

      // Make the API call
      const completion = await this.openAiApiClient.createChatCompletion(request);

      if (
        completion.data === undefined ||
        completion.data.choices.length === 0 ||
        completion.data.choices[0].message === undefined || 
        completion.data.choices[0].message.content === undefined
      ) {
        throw "No response";
      }

      // Check if a function was called
      if (completion.data.choices[0].message.function_call) {
        // Handle the function call. This could be a call to an external API,
        // running a database query, etc.
        const functionCall = completion.data.choices[0].message.function_call;
        const functionName = functionCall.name;
        const functionArgs = JSON.parse(functionCall.arguments || "");

        //const functionResponse = await this.callFunctionByName(functionName, functionArgs);

        // Append the function response to the conversation
        // conversation.messages.push({
        //   role: 'function',
        //   content: JSON.stringify(functionResponse),
        // });

        return "test";
      }

      // If no function was called, just return the response
      const response: string = completion.data.choices[0].message.content;
      return response;
    } catch (error) {
      console.error("Error calling function:", error);
      return "An error occurred. Please try again.";
    }
  }

  private getRole(message: IMessage): ChatCompletionResponseMessageRoleEnum {
    if (
      Object.values(ChatCompletionResponseMessageRoleEnum).findIndex(
        (role) => role === message.role
      ) !== -1
    ) {
      const roleIndex = Object.values(
        ChatCompletionResponseMessageRoleEnum
      ).findIndex((role) => role === message.role);
      return Object.values(ChatCompletionResponseMessageRoleEnum)[roleIndex];
    } else {
      throw "Incorrect role";
    }
  }

  private getDefaultCompletionRequest(conversation: IConversation): CreateChatCompletionRequest {
    return this.getCompletionRequest(conversation, this.configuration.model);
  }

  private getCompletionRequest(conversation: IConversation, model: string): CreateChatCompletionRequest {
    let requestMessages: ChatCompletionRequestMessage[] = [];
    if(conversation.messages) {
      conversation.messages.forEach((message) => {
        const role = this.getRole(message);
        requestMessages.push({ role: role, content: message.content });
      });
  
      const request: CreateChatCompletionRequest = {
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
