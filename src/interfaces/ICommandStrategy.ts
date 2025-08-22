import { Conversation } from "../db";

export interface ICommandStrategy {
    execute(args: string[]): Promise<boolean>;
  }