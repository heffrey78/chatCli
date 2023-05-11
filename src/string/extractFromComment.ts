const COMMENT_MARKERS = ['//', '#', '<!--'];

export const extractFromComment = async (fileContents: string): Promise<string> => {

        const lines = fileContents.split('\n');
        let extractedLine = '';
      
        for (let line of lines) {
          const trimmedLine = line.trim();
          const isComment = COMMENT_MARKERS.some(marker => trimmedLine.startsWith(marker));
      
          if (!isComment && !extractedLine) {
            extractedLine = trimmedLine;
            break;
          }
        }
      
        return extractedLine;
};