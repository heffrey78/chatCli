import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

  async function createEmbedding(inputText: string) {
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: inputText
    });

    return embeddingResponse.data.data[0].embedding;
  }

export { createEmbedding };