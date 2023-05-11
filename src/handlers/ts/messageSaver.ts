import { saveMessagesToFile } from '../../fileManager';

class MessageSaver {
  /**
   * Save a message using the saveMessagesToFile function from the fileManager module.
   * @param message The message to be saved.
   */
  public async saveMessage(path: string, messages: Array<string>): Promise<void> {
    try {
      await saveMessagesToFile(path, messages);
      console.log("Message saved successfully.");
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  }
}

export default MessageSaver;