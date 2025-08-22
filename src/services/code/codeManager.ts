import path from 'path';
import { saveToFile } from '../file/fileManager';

// Function to extract code blocks from the input text
function extractCodeBlocks(inputText: string): Map<string, string> {
  // Replace literal \n characters with actual newlines
  inputText = inputText.replace(/\\n/g, '\n');
  // Define the regular expression to match code blocks enclosed within triple backticks
  const codeBlockRegex = /```[^\r\n]*\r?\n([\s\S]*?)```/g;
  // Extract all code blocks from the input text
  let codeBlocks = new Map<string, string>();
  let counter = 1;
  let match;
  while ((match = codeBlockRegex.exec(inputText)) !== null) {
    const fileName = parseFileNameFromFile(match[1], counter++);
    codeBlocks.set(fileName, match[1]);
  }
  console.log(`Code blocks count ${codeBlocks.size}`);
  return codeBlocks;
}

// Function to writeToFiles code blocks with sequential numerical names
async function writeCodeBlocksToFiles(codeBlocks: Map<string, string>, outputDirectory: string): Promise<void> {      
  let counter = 1;
  for (const [fileName, codeBlock] of codeBlocks) {
    // Construct the output file path based on the counter
    const outputFileName = fileName || `script${counter}.sh`;
    const outputFilePath = path.join(outputDirectory, outputFileName);
    // writeToFiles the code block to the specified file
    await saveToFile(outputFilePath, codeBlock);
    // Increment the counter
    counter++;
  }
}

// Main function to extract and write code to files
async function extractAndWriteCodeToFile(inputText: string, outputDirectory: string): Promise<string> {
  try {
    // Extract code blocks from the input text
    const codeBlocks = extractCodeBlocks(inputText);
    // Write code blocks to files with sequential numerical names
    await writeCodeBlocksToFiles(codeBlocks, outputDirectory);
    return 'Code successfully written to files.';
  } catch (err) {
    throw new Error('Error writing to files: ' + err);
  }
}

const parseFileName = (input: string): string => {
  try {
    // The regex pattern to match the file path or name in comments starting with "/*", "//" or "#"
    const regex = /(\/\*(.*?)\*\/)|(\/\/(.*?)$)|(^#(.*?)$)/m;
    // Find the first match in the input string
    const match = input.match(regex);
    // Extract the matched file path or name
    const fileName = match ? match[2]?.trim() || match[4]?.trim() || match[6]?.trim() : null;
    return fileName || "";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in parseFileName:', error.message);
    } else {
      console.error('Unknown error in parseFileName');
    }
  }

  return "";
};

const parseFileNameFromFile = (fileContent: string, counter: number): string => {
  try {
    const COMMENT_MARKERS = ['//', '#', '<!--'];
    const lines = fileContent.split('\n');
    for (const line of lines) {
      const potentialMarker = COMMENT_MARKERS.find(marker => line.trim().startsWith(marker));
      if (potentialMarker) {
        const fileName = line.trim().replace(potentialMarker, "").trim();
        // Check if file name has a valid extension
        const fileExtensionPattern = /.\w{2,}$/;
        if (fileName.split(' ').length === 1 && fileExtensionPattern.test(fileName)) {
          return fileName;
        }
      }
    }
    return `file${counter}.txt`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in parseFileNameFromFile:', error.message);
    } else {
      console.error('Unknown error in parseFileNameFromFile');
    }
  }

  return "";
};

// Export the function as a module
export default extractAndWriteCodeToFile;