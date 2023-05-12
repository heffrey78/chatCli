const { getChatCompletion, getCodeCompletion, generateImage } = require('./openai');
const { readMessagesFromFile, saveConfigToFile, readConfigFromFile, executeShellScript } = require('./fileManager');
const { searchAndGetSummarizedItems, search } = require('./google');
const { convertWebpageToPdf }= require('./webHandler');
const getSystemInfo = require('./osInformation');
const { list } = require("./consoleManager");
const extractAndWriteCodeToFile = require("./codeManager");
const { saveMessagesToFile } = require ("./filesystem/saveMessagesToFile");
const { extractTextFromPdf } = require ('./web/readFromPdf');

async function handlePrompt(prompt, messages) {
    const config = await readConfigFromFile();
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
          if(messages.findIndex(message => message.role === 'system') === -1){
            const systemInfo = getSystemInfo();
            const systemMessage = ` Unless otherwise specificed, development should target a system with the following information: ${JSON.stringify(systemInfo)} \r\n` +
            ' Act as an expert in mentioned technologies. Use best practices.';
            messages.push({ role: "system", content: systemMessage });
          } 
                  
          prompt += ' IMPORTANT: Give every file a name. \r\n';

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
      const readMessages = await readMessagesFromFile(arg);
      readMessages.forEach((message) => {
        messages.push({ role: message.role, content: message.content });
      });
      console.log(`Loaded messages from ${arg}.json`);
    } else if (command === 'LIST') {
      if(messages){
        console.log(list(messages));
      }
    } else if (command === 'CLEAR') {
      messages = [];
      console.log(`Cleared messages from memory`);
    } else if (command ==='SETMODEL') {
      let config = await readConfigFromFile();
      config.model = arg;
      await saveConfigToFile(config);
    } else if(command === 'ADDSEARCH') {
      await searchHandler(prompt, messages);
    } else if(command === 'ADDPAGE') {
      console.log(prompt);
      await pageHandler(prompt, messages);
    } else if (command ==='SEARCHLIST') {
      let items = await searchAndGetSummarizedItems(prompt);
      console.log(items);
    } else if (command ==='SEARCHBEST') {
        await searchAndSummarize(prompt, messages);
    } else if (command ==='CODE') {
        let config = await readConfigFromFile();
        config.code = arg;
        await saveConfigToFile(config);
    } else if (command ==='DUMPCODE') {
      console.log("Extracting code from message");
      await extractAndWriteCodeToFile(messages[arg].content, "./output/");
    } else if(command ==='IMAGE') {
      const imageUrl = await generateImage(prompt);
      console.log(`Image: ${imageUrl}`);
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

  async function searchAndSummarize(arg, messages) {
    await searchHandler(arg, messages);
    await summarize(pageContent, messages);
  }

  async function searchHandler(arg, messages) {
    let items = await searchAndGetSummarizedItems(arg);
    const summaryQuery = `Return only the formatted url of the search result that most closely matches this search term: '${arg}' \r\n Results: ${JSON.stringify(items.slice(0, 10))}`;

    messages.push({ role: 'user', content: summaryQuery });
    let response = await getChatCompletion(messages);
    messages.push({ role: 'assistant', content: response });
    console.log('Best Response:', response);
    await convertWebpageToPdf(response, 'output/test.pdf', null);
    let pageContent = await extractTextFromPdf('output/test.pdf');
    messages.push({role: 'user', content: `Please summarize the following: ${pageContent}`});
    response = await getChatCompletion(messages);
    messages.push({role: 'assistant', content: response});
    console.log(response);
  }

  async function pageHandler(arg, messages) {    
    await convertWebpageToPdf(arg, 'output/test.pdf', null);
    let fileName = args.replace(' ', '-');
    let pageContent = await extractTextFromPdf(`output/${fileName}.pdf`);
    messages.push({role: 'user', content: `Please summarize the following: ${pageContent}`});
    response = await getChatCompletion(messages);
    messages.push({role: 'assistant', content: response});
    console.log(response);
  }

  async function summarize(arg, messages) {
    messages.push({role: 'user', content: `Please summarize the following: ${arg}`});
    response = await getChatCompletion(messages);
    messages.push({role: 'assistant', content: response});
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