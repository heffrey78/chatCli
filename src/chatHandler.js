const { getChatCompletion, getCodeCompletion } = require('./openai');
const { saveMessagesToFile, readMessagesFromFile, saveConfigToFile, readConfigFromFile, executeShellScript } = require('./fileManager');
const { searchAndGetSummarizedItems, search } = require('./google');
const extractMainContent = require('./webHandler');
const getSystemInfo = require('./osInformation');

async function handlePrompt(prompt, messages) {
    const config = await readConfigFromFile();
    if(messages.length == 0){
      console.table(config);
    }
    const parsedPrompt = parsePrompt(prompt);
    let command = null;
    let arg = null;
    let response = {};

    if(parsedPrompt.command) {
      command = parsedPrompt.command.toUpperCase();
      arg = (parsedPrompt.arg || parsedPrompt.quotedArg || "").replace(/['"]/g, "");
    }    

    if (!command){
        if(config.code === 'true') {
          const systemInfo = getSystemInfo();
          prompt += ' start by creating a directory structure. give the project and appropriate name.';
          prompt += ` unless otherwise specificed, development should primarly target a system with the following information: ${JSON.stringify(systemInfo)} \r\n`;
          prompt += ' act as an expert in mentioned technologies. use best practices. \r\n'
          prompt += ' all code examples should start the file with a comment containing the appropriate filepath and file name. \r\n' +  
          ' all command examples or node executions should start with a comment that indicates the appropriate filepath and file name.'
          messages.push({ role: "user", content: prompt });
          response = await getCodeCompletion(messages);
      } else {
          messages.push({ role: "user", content: prompt });
          response = await getChatCompletion(messages);
      }

      messages.push({ role: "assistant", content: response });
      console.log("Assistant:", response);
    } else if (command === 'SAVE') {
      await saveMessagesToFile(arg, messages);
    } else if (command === 'OPEN') {
      messages = await readMessagesFromFile(arg);
      console.log(`Loaded messages from ${arg}.json`);
    } else if (command === 'CLEAR') {
      messages = [];
      console.log(`Cleared messages from memory`);
    } else if (command ==='SETMODEL') {
      let config = await readConfigFromFile();
      config.model = arg;
      await saveConfigToFile(config);
    } else if (command ==='SEARCHLIST') {
      let items = await searchAndGetSummarizedItems(arg);
      console.log(items);
    } else if (command ==='SEARCHBEST') {
        await searchBestHandler(arg, messages);
    } else if (command ==='CODE') {
        let config = await readConfigFromFile();
        config.code = arg;
        await saveConfigToFile(config);
    } else if (command ==='EXECUTE') {
        let response = await executeShellScript(arg);
        console.log(response);
    } else if (command ==='EXIT') {
        console.log("Exiting the program.");
        return true;
    } else {
      console.log('Unknown command');
    }
    return false;
  }

  async function searchBestHandler(arg, messages) {
    let items = await searchAndGetSummarizedItems(arg);
    const summaryQuery = `Return only the formatted url of the search result that most closely matches this search term: '${arg}' \r\n Results: ${JSON.stringify(items.slice(0, 5))}`;

    messages.push({ role: 'user', content: summaryQuery });
    let response = await generateChatCompletion(messages);
    messages.push({ role: 'assistant', content: response });
    console.log('Best Response:', response);
    const content = await extractMainContent(response);
    messages.push({role: 'user', content: `summarize ${content}`});
    response = await generateChatCompletion(messages);
    console.log(response);
  }

  function parsePrompt(prompt) {
    const commandMatch = prompt.match(/^\.(?<command>[a-zA-Z]+)(\s+((?<arg>[\w-]+)|(['"](?<quotedArg>[^'"]+)['"])))?$/);
  
    if (commandMatch) {
      const { groups: { command, arg, quotedArg } } = commandMatch;
      return { command, arg, quotedArg };
    }
  
    return { command: null, arg: null, quotedArg: null };
  }

 module.exports = {
    parsePrompt,
    handlePrompt
 }