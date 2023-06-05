import { IConfig } from "../types";

class ConfigFile implements IConfig {
    model: string;
    code: boolean;

    public constructor(model: string, code: boolean){
        this.model = model;
        this.code = code;
    }
}

export default ConfigFile;