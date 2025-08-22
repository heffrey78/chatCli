import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { JiraHandler } from "../../services/web/jira/jiraHandler";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "JiraQueryCommand",
  description: "Executes a Jira search and returns a list of results",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] is a string containing the search terms"
    }
  },
  required: ["args"],
})
export class JiraQueryCommand implements ICommandStrategy {  
  async execute(args: string[]): Promise<boolean> {
    const handler = new JiraHandler();
    const result = await handler.queryIssues(args[0]);
    console.log(JSON.stringify(result));
    return false;
  }
}