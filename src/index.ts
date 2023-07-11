import * as dotenv from "dotenv";
import readline from "readline";
import { TYPES, Handler } from "./types";
import { container } from "./inversify.config";
import { Conversation, sequelize } from "./db";

dotenv.config();

let conversation: Conversation = new Conversation();
conversation.messages = [];
let count = 0;

async function promptUser(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false, // Set to false
  });

  let prompt: string = "";
  let exit: Boolean | undefined = false;

  process.stdout.write("> ");

  rl.on("line", async (line) => {
    if (line.trim() == ".") {
      count = count + 1;
      if (count >= 1) {
        const chatHandler = container.get<Handler>(TYPES.Handler);
        exit = await chatHandler.handle(prompt, conversation);
        prompt = "";
        process.stdout.write("> ");
        if (exit) {
          rl.close();
        }
      }
    } else if (line.trim() !== "") {
      count = 0;
      prompt += line + "\n";
    }
  });

  rl.on("SIGINT", () => {
    rl.question("Do you want to exit? (yes/no) ", (answer) => {
      if (answer.match(/^y(es)?$/i)) {
        rl.pause();
      } else {
        process.stdout.write("> ");
      }
    });
  });
}

async function startup(): Promise<void> {
  if(process.env.USE_POSTGRES === "true") {
    await sequelize.authenticate();
    await sequelize.sync();
    await promptUser();  
  } 
}

startup();

