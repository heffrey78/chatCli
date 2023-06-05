require("dotenv").config();
const readline = require("readline");
const stream = require('stream');
const { handlePrompt } = require("./chatHandler");

let messages = []; 
let count = 0;

// writable stream that discards data
const output = new stream.Writable({
  write(chunk, encoding, callback) {
    callback();
  }
});

async function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: output,
    terminal: false,  // Set to false
  });

  let prompt = '';
  let exit = false;  

  process.stdout.write('> ');

  rl.on('line', async (line) => {
    if(line.trim() == '.'){
      count = count + 1;
      if(count >= 1){
        exit = await handlePrompt(prompt, messages);
        prompt = ''; 
        process.stdout.write('> ');
        if(exit) {
          rl.close();
        }
      } 
    } else if(line.trim() !== '') {
      count = 0;
      prompt += line + '\n';
    }

   // process.stdout.write('> ');
  });

  rl.on('SIGINT', () => {
    rl.question('Do you want to exit? (yes/no) ', (answer) => {
      if (answer.match(/^y(es)?$/i)) {
        rl.pause();
      } else {
        process.stdout.write('> ');
      }
    });
  });
}

promptUser();
