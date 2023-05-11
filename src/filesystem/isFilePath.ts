import * as fs from 'fs';
import * as path from 'path';

export const isFilePath = async (filePath: string): Promise<boolean> => {
    try {
      const resolvedPath = path.resolve(filePath);
      const stats = await fs.statSync(resolvedPath);
  
      return stats.isFile() || stats.isDirectory();
    } catch (error) {
      return false;
    }
};