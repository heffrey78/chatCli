import * as FileManager from '../fileManager';

export const readFromFile = async (path: string): Promise<string> => {
    return await FileManager.readFromFile(path);
};