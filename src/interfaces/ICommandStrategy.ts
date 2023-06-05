export interface ICommandStrategy {
    execute(args: string[], messages: any[]): Promise<boolean>;
  }