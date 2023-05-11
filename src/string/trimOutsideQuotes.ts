export const trimOutsideQuotes = (text: string) : string => {
    const firstChar = text.charAt(0);
    const lastChar = text.charAt(text.length - 1);
  
    if ((firstChar === '"' && lastChar === '"') ||
      (firstChar === "'" && lastChar === "'")) {
      return text.slice(1, -1);
    }
  
    return text;
};
