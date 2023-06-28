import * as dotenv from "dotenv";
import readline from "readline";
import { TYPES, IHandler, IMessage } from "./types";
import { container } from "./inversify.config";
import { AppDataSource } from "./data-source";
import { createDatabase } from "typeorm-extension";

dotenv.config();

let messages: IMessage[] = [];
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
        const chatHandler = container.get<IHandler>(TYPES.Handler);
        exit = await chatHandler.handle(prompt, messages);
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

createDatabase({ options: AppDataSource.options }).then(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    await promptUser();
}).catch((error) => console.log("Error: ", error));

