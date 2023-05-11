const { Configuration, OpenAIApi } = require("openai");
const extractAndWriteCodeToFile = require("./codeManager");
const { readConfigFromFile } = require('./fileManager');
const outputDirectory = "./output/";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getChatCompletion(messages) {
    return await generateChatCompletion(messages);
}

async function getCodeCompletion(messages) {
  try {
    console.log("Generating code from prompt");
    const response = await generateChatCompletion(messages);
    await extractAndWriteCodeToFile(response, outputDirectory);

    return response;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    return "An error occurred. Please try again.";
  }
}

async function generateChatCompletion(messages) {
    try {
        const config = await readConfigFromFile(); 
        const completion = await openai.createChatCompletion({
          model: config.model,
          messages,
        });
    
        const response = completion.data.choices[0].message.content;
    
        return response;
      } catch (error) {
        console.error("Error generating chat completion:", error);
        return "An error occurred. Please try again.";
      }
}

async function generateImage (prompt) {
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  
  if(response.data && response.data.data && response.data.data.length > 0){
    const image_url = response.data.data[0].url;
    return image_url;
  } else {
    throw new Error('No data available in the response');
  }
}

module.exports = {
  getChatCompletion,
  getCodeCompletion,
  generateImage
};
