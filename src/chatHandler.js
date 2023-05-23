const {
  getChatCompletion,
  getCodeCompletion,
  generateImage,
} = require("./openai");
const {
  readMessagesFromFile,
  saveConfigToFile,
  readConfigFromFile,
  executeShellScript,
} = require("./fileManager");
const { searchAndGetSummarizedItems, search } = require("./google");
const { convertWebpageToPdf } = require("./webHandler");
const getSystemInfo = require("./osInformation");
const { list } = require("./consoleManager");
const extractAndWriteCodeToFile = require("./codeManager");
const { saveMessagesToFile } = require("./filesystem/saveMessagesToFile");
const { extractTextFromPdf } = require("./web/readFromPdf");

async function handlePrompt(prompt, messages) {
  let command = null;
  let args = null;
  let argText = null;
  let response = {};

  const config = await readConfigFromFile();
  const parsedPrompt = parsePrompt(prompt);

  command = parsedPrompt ? parsedPrompt.command.toUpperCase() : null;
  args = parsedPrompt ? parsedPrompt.args : [];
  argText = parsedPrompt ? parsedPrompt.argText : "";

  if (!command) {
    if (config.code === "true") {
      if (messages.findIndex((message) => message.role === "system") === -1) {
        const systemInfo = getSystemInfo();
        const systemMessage =
          ` Unless otherwise specificed, development should target a system with the following information: ${JSON.stringify(
            systemInfo
          )} \r\n` +
          " Act as an expert in mentioned technologies. Use best practices. Give every file a name in comments";
        messages.push({ role: "system", content: systemMessage });
      }

      messages.push({ role: "user", content: prompt });
      response = await getCodeCompletion(messages);
    } else {
      messages.push({ role: "user", content: prompt });
      response = await getChatCompletion(messages);
    }

    messages.push({ role: "assistant", content: response });
    console.log("Assistant:", response);
  } else if (command === "SAVE") {
    await saveMessagesToFile(args[0], messages);
  } else if (command === "OPEN") {
    const readMessages = await readMessagesFromFile(args[0]);
    readMessages.forEach((message) => {
      messages.push({ role: message.role, content: message.content });
    });
    console.log(`Loaded messages from ${args[0]}.json`);
  } else if (command === "LIST") {
    if (messages) {
      console.log(list(messages));
    }
  } else if (command === "CLEAR") {
    messages.length = 0;
    console.log(`Cleared messages from memory`);
  } else if (command === "SETMODEL") {
    let config = await readConfigFromFile();
    config.model = args[0];
    await saveConfigToFile(config);
  } else if (command === "ADDSEARCH") {
    await searchHandler(args[0], messages);
  } else if (command === "ADDPAGE") {
    await pageHandler(args[0], messages);
  } else if (command === "SEARCHLIST") {
    let items = await searchAndGetSummarizedItems(args[0]);
    console.log(items);
  } else if (command === "SEARCHBEST") {
    await searchAndSummarize(prompt, messages);
  } else if (command === "CODE") {
    let config = await readConfigFromFile();
    config.code = args[0];
    await saveConfigToFile(config);
  } else if (command === "DUMPCODE") {
    console.log("Extracting code from message");
    await extractAndWriteCodeToFile(messages[args[0]].content, "./output/");
  } else if (command === "IMAGE") {
    const urls = await generateImage(argText);
    urls.forEach((url) => {
      console.log(url);
    });
  } else if (command === "EXECUTE") {
    let response = await executeShellScript(args[0]);
    console.log(response);
  } else if (command === "EXIT") {
    console.log("Exiting the program.");
    return true;
  } else {
    console.log("Unknown command");
  }
  return false;
}

async function searchAndSummarize(arg, messages) {
  await searchHandler(arg, messages);
  await summarize(pageContent, messages);
}

async function searchHandler(arg, messages) {
  let items = await searchAndGetSummarizedItems(arg);
  const summaryQuery = `Return only the formatted url of the search result that most closely matches this search term: '${arg}' \r\n Results: ${JSON.stringify(
    items
  )}`;

  messages.push({ role: "user", content: summaryQuery });
  let response = await getChatCompletion(messages);
  messages.push({ role: "assistant", content: response });
  console.log("Best Response:", response);
  await convertWebpageToPdf(response, "output/test.pdf", null);
  const pageContent = await extractTextFromPdf("output/test.pdf");
  return pageContent;
}

async function pageHandler(arg, messages) {
  await convertWebpageToPdf(arg, "output/test.pdf", null);
  let fileName = args.replace(" ", "-");
  let pageContent = await extractTextFromPdf(`output/${fileName}.pdf`);
  messages.push({
    role: "user",
    content: `Please summarize the following: ${pageContent}`,
  });
  response = await getChatCompletion(messages);
  messages.push({ role: "assistant", content: response });
  console.log(response);
}

async function summarize(arg, messages) {
  messages.push({
    role: "user",
    content: `Please summarize the following: ${arg}`,
  });
  response = await getChatCompletion(messages);
  messages.push({ role: "assistant", content: response });
  console.log(response);
}

function parsePrompt(prompt) {
  if (prompt.indexOf(".") === 0) {
    // Remove the leading dot
    let text = prompt.substring(1);
    let command,
      args = [],
      argText;

    // Extract command
    let commandEnd = text.indexOf(" ");
    if (commandEnd === -1) {
      // There is only a command, no arguments
      command = text;
    } else {
      command = text.substring(0, commandEnd).toUpperCase();
      text = text.substring(commandEnd + 1);
      if (
        (text.startsWith("'") && text.endsWith("'")) ||
        (text.startsWith('"') && text.endsWith('"'))
      ) {
        text = text.slice(1, -1);
      }
      argText = text.trim();
    }

    // Extract arguments
    let match;
    let re = /"([^"]*)"|'([^']*)'|([^ ]+)/g;
    while ((match = re.exec(text))) {
      let arg = match[1] || match[2] || match[3];
      args.push(arg);
    }

    // Return result
    return { command, args, argText };
  }
  return;
}

module.exports = {
  parsePrompt,
  handlePrompt,
};
