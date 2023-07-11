import { Conversation } from "../db";

export interface ICommandStrategy {
    execute(args: string[], conversation: Conversation): Promise<boolean>;
  }