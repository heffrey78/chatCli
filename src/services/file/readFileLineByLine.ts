import * as fs from 'fs';
import * as readline from 'readline';

async function readFileLineByLine(filePath: string, lineHandler: (line: string) => void): Promise<void> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    lineHandler(line);
  }
}

export default readFileLineByLine;