import { IConfig } from "../types";

export interface IConfiguration {
    [key: string]: any;
    model: string;
    code: boolean;
    postgres: boolean;
    writeConfigurationFile(config: IConfig): Promise<void>;
  }