import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { injectable } from "inversify";
import { JiraHandler } from "../../services/web/jira/jiraHandler";
import { Conversation } from "../../db";

@injectable()
export class JiraQueryCommand implements ICommandStrategy {  
  async execute(args: string[]): Promise<boolean> {
    const handler = new JiraHandler();
    const result = await handler.queryIssues(args[0]);
    console.log(JSON.stringify(result));
    return false;
  }
}