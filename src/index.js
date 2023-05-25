require("dotenv").config();
const readline = require("readline");
const { handlePrompt } = require("./chatHandler");
const keypress = require("keypress");
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

  keypress(process.stdin);

  let prompt = '';
  let exit = false;  

  rl.prompt();

  process.stdin.on('keypress', async function (ch, key) {

    if (key && key.name == 'down' && prompt.length > 0) {
      exit = await handlePrompt(prompt, messages);

      if(exit){
        rl.close();
      } else {
        prompt = '';
        rl.prompt();
      }
    } 
  });

  rl.on('line', async (line) => {
      prompt += line + '\
      ';
      rl.prompt();
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
