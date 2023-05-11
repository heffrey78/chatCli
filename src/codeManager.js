const fs = require('fs');
const path = require('path');
const util = require('util');
const { saveToFile } = require('./fileManager');
const { trimOutsideQuotes } = require('./string/trimOutsideQuotes');


// Function to extract code blocks from the input text
function extractCodeBlocks(inputText) {
  const fileName = parseFileNameFromFile(inputText);
  // Replace literal \n characters with actual newlines
  inputText = inputText.replace(/\\n/g, '\n');

  // Define the regular expression to match code blocks enclosed within triple backticks
  const codeBlockRegex = /```[^\r\n]*\r?\n([\s\S]*?)```/g;

  // Extract all code blocks from the input text
  let codeBlocks = new Map();
  let match;
  while ((match = codeBlockRegex.exec(inputText)) !== null) {
    //codeBlocks.push(match[1]);
    codeBlocks.set(fileName, match[1]);
  }
  return codeBlocks;
}

// Function to write code blocks to files with sequential numerical names
async function writeCodeBlocksToFiles(codeBlocks, outputDirectory) {
  let counter = 1;
  for (const [fileName, codeBlock] of codeBlocks) {
    // Construct the output file path based on the counter
    const outputFileName = fileName || `script${counter}.sh`;
    const outputFilePath = path.join(outputDirectory, outputFileName);

    // Write the code block to the specified file
    await saveToFile(outputFilePath, codeBlock);

    // Increment the counter
    counter++;
  }
}

// Main function to extract and write code to files
async function extractAndWriteCodeToFile(inputText, outputDirectory) {
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


const parseFileName = (input) => {
  // The regex pattern to match the file path or name in comments starting with "/*" or "#"
  const regex = /(\/\*(.*?)\*\/)|(^#(.*?)$)/m;

  // Find the first match in the input string
  const match = input.match(regex);

  // Extract the matched file path or name
  const fileName = match ? match[2]?.trim() || match[4]?.trim() : null;

  return fileName;
};

const parseFileNameFromFile = (fileContent) => {
  const COMMENT_MARKERS = ['//', '#', '<!--'];

  const lines = fileContent.split('\n');
  
  for (const line of lines) {
    const potentialMarker = COMMENT_MARKERS.find(marker => line.trim().startsWith(marker));

    if (potentialMarker) {
      const fileName = line.trim().substr(potentialMarker.length).trim();
      return fileName;
    }
  }
  
  return null;
}

// Export the function as a module
module.exports = extractAndWriteCodeToFile;
