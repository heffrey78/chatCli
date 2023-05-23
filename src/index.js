require("dotenv").config();
const readline = require("readline");
const { handlePrompt } = require("./chatHandler");
// import { container } from "./inversify.config";
// import strategyFactory from "./StrategyFactory";

let messages = []; 

async function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
    prompt: ':> '
  });

  let prompt = '';
  let exit = false;

  rl.prompt();

  rl.on('line', async (line) => {
    if (line === '.') {
      exit = await handlePrompt(prompt, messages);
      if(!exit){
        prompt = '';
        rl.prompt();
      } else {
        rl.close();
      }
    } else {
      prompt += line + '\
      ';
      rl.prompt();
    }
  });

  rl.on('SIGINT', () => {
    rl.question('Do you want to exit? (yes/no) ', (answer) => {
      if (answer.match(/^y(es)?$/i)) {
        rl.pause();
      } else {
        rl.prompt();
      }
    });
  });
}

promptUser();
