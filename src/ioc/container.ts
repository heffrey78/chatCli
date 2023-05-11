import { promises as fs } from 'fs';
import * as path from 'path';
import { FuncWrapper } from './funcWrapper';

type FuncConfig = {
  name: string;
  path: string;
  params: Array<{ name: string; type: string }>;
  returnType: string;
};

class IOCContainer {
  private readonly container: Map<string, FuncWrapper> = new Map();

  async loadConfig(configPath: string): Promise<void> {
    const rawConfig = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(rawConfig);
    const funcConfigs: FuncConfig[] = config["functions"];

    for (const config of funcConfigs) {
      await this.loadFunction(config);
    }
  }

  private async loadFunction(config: FuncConfig): Promise<void> {
    const modulePath = path.resolve(config.path);
    const moduleExports: Record<string, any> = await import(modulePath);

    const func: FuncWrapper = moduleExports[config.name];
    func._params = config.params;
    func._returnType = config.returnType;

    this.container.set(config.name, func);
  }

  get<T extends FuncWrapper>(key: string): T {
    const func = this.container.get(key);

    if (!func) {
      throw new Error(`Function not found: ${key}`);
    }

    return func as T;
  }
}

// Export the instance of the container
export const iocContainer = new IOCContainer();