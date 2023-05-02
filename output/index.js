// Filename: index.js

const iocContainer = require('./ioc_container');
const promptHandler = iocContainer.resolve('prompt_handler'); // Name based on the file name

async function main() {
  // Example usage of the prompt handler
  const prompt = 'Enter your name:';
  const messages = ['Hello, my name is...'];
  await promptHandler.handlePrompt(prompt, messages);
}

main();
