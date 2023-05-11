import * as FileManager from '../fileManager';

export const saveMessagesToFile = async (path: string, messages: Array<string>): Promise<void> => {
    await FileManager.saveMessagesToFile(path, messages);
};