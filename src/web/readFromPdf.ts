// Import required packages
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');


// Define the async function to extract text from the PDF
export const extractTextFromPdf = async (pdfPath: string) : Promise<string> => {
  try {
    const pdfBuffer =  await fs.readFile(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;
    return extractedText;
  } catch (error) {
    console.error('Error extracting text from the PDF:', error);
    throw error;
  }
};

