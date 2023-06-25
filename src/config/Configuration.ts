import fs from "fs";
import { injectable } from "inversify";
import { IConfiguration } from "../interfaces/IConfiguration";
import { IConfig } from "../types";

@injectable()
class Configuration implements IConfiguration {
  model: string;
  code: boolean;
  postgres: boolean;

  constructor() {
    const config = this.readConfigurationFile();

    this.model = config?.model || "gpt-4";
    this.code = config?.code ? true : false;
    this.postgres = config?.postgres ? true: false;
  }

  readConfigurationFile(): IConfig | undefined {
    try {
      const configPath = process.env.CONFIGPATH || './config.json';
      const fileContent = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(fileContent) as IConfig;

      // Ensure that 'model' is a string and 'code' is a boolean
      if (
        typeof config.model !== "string" ||
        typeof config.code !== "boolean" ||
        typeof config.postgres !== "boolean"
      ) {
        throw new Error("Invalid configuration format");
      }

      return config;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error reading the configuration file: ${error.message}`);
      } else {
        console.error(
          "An unexpected error occurred while reading the configuration file"
        );
      }
    }
  }

  public async writeConfigurationFile(config: IConfig): Promise<void> {
    try {
      const serializedConfig = JSON.stringify(config, null, 2);
      const configPath = process.env.CONFIGPATH || './config.json';
      await fs.promises.writeFile(configPath, serializedConfig);
      console.log("Configuration file saved.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error saving the configuration file: ${error.message}`);
      } else {
        console.error("An unexpected error occurred while saving the configuration file");
      }
    }
  }
}

export { Configuration };
