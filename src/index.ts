import * as dotenv from "dotenv";
import readline from "readline";
import { TYPES, ICommandStrategy } from "./types";
import { container } from "./inversify.config";
import { sequelize } from "./db";

dotenv.config();

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

  rl.on("line", async (line) =>
   {
    if (line.startsWith(".")) {
      count = count + 1;
      if (count >= 1) {
        prompt += line;
        const chatHandler = container.get<ICommandStrategy>(TYPES.Command.ChatHandler);
        exit = await chatHandler.execute([prompt]);
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
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');
    await promptUser();  
  } 
}

startup();

