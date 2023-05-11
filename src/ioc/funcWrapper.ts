export type FuncWrapper<T = (...args: any[]) => any> = T & {
    _params: Array<{ name: string; type: string }>;
    _returnType: string;
  };