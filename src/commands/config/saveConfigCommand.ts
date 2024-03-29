import { ICommandStrategy } from "../../interfaces/ICommandStrategy";
import { IConfiguration } from "../../interfaces/IConfiguration";
import { inject } from "inversify";
import { TYPES, IConfig } from "../../types";
import ConfigFile from "../../config/ConfigFile";
import { functionDetails } from "../../decorators/functionalDetails";

@functionDetails({
  name: "SaveConfigCommand",
  description: "Saves a configuration setting",
  parameters: {
    args: {
      type: "array",
      items: { type: "string "},
      description: "args[0] contains the configuration property. args[1] contains the configuration value."
    }
  },
  required: ["args"],
})
export class SaveConfigCommand implements ICommandStrategy {
  configuration: IConfiguration;

  public constructor(
    @inject(TYPES.Configuration) configuration: IConfiguration
  ) {
    this.configuration = configuration;
  }

  async execute(args: string[]): Promise<boolean> {
    const config: IConfig = 
    new ConfigFile(
      this.configuration.model,
      this.configuration.code,
      this.configuration.postgres
    );

    for (let i = 0; i < args.length; i += 2) {
      let property = args[i].replace(/\'/g, '');
      if (args[i + 1] && config.hasOwnProperty(property)) {
        let value = args[i + 1];
        if (Boolean(value) && typeof config[property] === "boolean") {
          if(config[property])
          config[property] = this.booleanify(value);
          this.configuration[property] = this.booleanify(value);
        } else if (Number(value) && typeof config[property] === "number") {
          config[property] = Number(value);
          this.configuration[property] = Number(value);
        } else {
          config[property] = value;
          this.configuration[property] = value;
        }
      }
    }

    try {
      await this.configuration.writeConfigurationFile(config);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error parsing the configuration: ${error.message}`);
      } else {
        console.error(
          "An unexpected error occurred while parsing the configuration"
        );
      }
    }

    return false;
  }

  booleanify(value: string): boolean {
    const truthy: string[] = ["true", "True", "1"];

    return truthy.includes(value);
  }
}
