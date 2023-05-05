require("dotenv").config();
const readline = require("readline");
const { handlePrompt } = require("./chatHandler");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let messages = []; 

async function promptUser() {
  rl.question("User: ", async (prompt) => {
    const exit = await handlePrompt(prompt, messages);

    if(exit){
        rl.close();
        return;
    } else {
        promptUser();
    }
  });
}

promptUser();
