import { IConfig } from "../types";

class ConfigFile implements IConfig {
    model: string;
    code: boolean;
    postgres: boolean;

    public constructor(model: string, code: boolean, postgres: boolean){
        this.model = model;
        this.code = code;
        this.postgres = postgres;
    }
}

export default ConfigFile;