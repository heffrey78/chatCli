import { container } from "../../inversify.config";
import { exec } from "child_process";
import { promises as fs } from "fs";
import * as path from "path";
import * as util from "util";
import * as pdf from "pdfjs-dist";
import { TYPES } from "../../types";
import { ISystemInformation } from "../../interfaces/system/ISystemInformation";


const execPromise = util.promisify(exec);

async function readMessagesFromFile(filename: string): Promise<any> {
  const messages = await readFromFile(`messages/${filename}`);
  return messages;
}

async function readFromFile(filename: string): Promise<any> {
  try {
    if (!filename.includes(".")) {
      filename += ".json";
    }
    const data = await fs.readFile(`./${filename}`, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from file:", error);
    return [];
  }
}

async function saveMessagesToFile(
  filename: string,
  messages: any
): Promise<void> {
  await saveJsonFile(`messages/${filename}`, messages);
}

async function saveJsonFile(filename: string, content: any): Promise<void> {
  if (!filename.includes(".")) {
    filename += ".json";
  }
  await saveToFile(filename, JSON.stringify(content, null, 2));
}

async function saveToFile(filename: string, content: string): Promise<void> {
  try {
    const dir = path.dirname(filename);
    const file = path.basename(filename);
    const dirname = path.isAbsolute(dir)
      ? dir
      : path.join(path.resolve(process.cwd()), dir);
    await createFolderIfNotExists(`${dirname}`);
    await fs.writeFile(`${path.join(dirname, file)}`, content);
    console.log(`Content saved to ${file}`);
  } catch (err) {
    console.error(`Error saving file: ${filename}, ${err}`);
  }
}

async function createFolderIfNotExists(directoryPath: string): Promise<void> {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (err) {
    console.log(`Error creating directory ${directoryPath}, ${err}`);
  }
}

async function executeShellScript(filePath: string): Promise<string | void> {
  const systemInfo = container.get<ISystemInformation>(TYPES.SystemInformation);
  let shellCommand = "";
  if (systemInfo.platform === "win32") {
    shellCommand = "cmd.exe /c";
  } else {
    shellCommand = "bash";
  }
  try {
    const result = await execPromise(`${shellCommand} ${filePath}`);
    return result.stdout;
  } catch (err) {
    console.error(`Error: ${err}`);
    return;
  }
}

async function readPDFToString(pdfPath: string): Promise<string> {
  try {
    // Load the PDF file
    const data = new Uint8Array(await fs.readFile(pdfPath));
    let pagesText: string[] = [];

    // Load the PDFDocument from the loaded data
    const pdfDocument = pdf.getDocument(data);

    await pdfDocument.promise.then(async function (pdf) {
      // you can now use *pdf* here
      const pageCount = pdf.numPages;

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((value: any) => value.str).join(" ");
        pagesText.push(pageText);
      }
    });

    return JSON.stringify(pagesText);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error reading the pdf: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred while reading ${pdfPath}`);
    }
    return "";
  }
}

export {
  saveToFile,
  readFromFile,
  saveJsonFile,
  saveMessagesToFile,
  readMessagesFromFile,
  executeShellScript,
  readPDFToString,
};
