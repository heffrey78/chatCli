// Interfaces
import IStrategy from "./interfaces/IStrategy";
import IStrategySearch from "./interfaces/web/IStrategySearch";

// Bindings
export const TYPES = {
    IStrategy: Symbol.for("IStrategy"),
    IStrategySearch: Symbol.for("IStrategySearch")
  };
  
export { IStrategy, 
    IStrategySearch 
};