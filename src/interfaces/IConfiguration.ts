import { IConfig } from "../types";

export interface IConfiguration {
    [key: string]: any;
    model: string;
    code: boolean;
    writeConfigurationFile(config: IConfig): Promise<void>;
  }