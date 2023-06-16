import { container } from "../../inversify.config";
import { exec } from "child_process";
import { promises as fs, ReadStream, createReadStream } from "fs";
import { extname, dirname, basename, isAbsolute, join, resolve} from "path";
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
    const dir = dirname(filename);
    const file = basename(filename);
    const directoryName = isAbsolute(dir)
      ? dir
      : join(resolve(process.cwd()), dir);
    await createFolderIfNotExists(directoryName);
    await fs.writeFile(`${join(directoryName, file)}`, content);
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

export function readImage(path: string): ReadStream {
  const extension = extname(path).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

  if (!allowedExtensions.includes(extension)) {
    throw new Error('Invalid image format.');
  }

  return createReadStream(path);
}

export interface DirectoryEntry {
  name: string;
  children?: DirectoryEntry[];
}

async function getDirectoryStructure(dirPath: string, parent: DirectoryEntry): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const entryPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const child: DirectoryEntry = { name: entry.name };
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(child);
      getDirectoryStructure(entryPath, child);
    } else if (entry.isFile()) {
      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push({ name: entry.name });
    }
  });
}

async function getDirectoryStructureAsString(dirPath: string): Promise<string> {
  const root: DirectoryEntry = { name: basename(dirPath) };
  await getDirectoryStructure(dirPath, root);
  return JSON.stringify(root, undefined, 2);
}

export {
  saveToFile,
  readFromFile,
  readPDFToString,
  saveJsonFile,
  saveMessagesToFile,
  readMessagesFromFile,
  executeShellScript,
  getDirectoryStructureAsString
};
