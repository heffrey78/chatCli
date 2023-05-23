import { inject, injectable } from "inversify";
import { TYPES, IStrategy } from "./types";

@injectable()
class StrategyFactory {
  private strategies: any = {};

  constructor(@inject(TYPES.IStrategy) strategies: IStrategy<any>[]) {
    for (const strategy of strategies) {
      const key = strategy.name;
      this.strategies[key] = strategy;
    }
  }

  public async executeStrategy(key: string, input: string[]): Promise<string> {
    const strategy: IStrategy<any> = this.strategies[key];
    return await strategy.execute(input);
  }

  public exists(key: string): Boolean {
    return this.strategies.findIndex((x: string) => x === key);
  }

  public get(key: string): IStrategy<any> {
    return this.strategies[key];
  }
}

const strategyFactory = (strategies: IStrategy<any>[]) =>
  new StrategyFactory(strategies);

export default strategyFactory;