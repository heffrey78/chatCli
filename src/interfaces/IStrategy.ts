interface IStrategy<type> {
  name: string;
  execute(input: string[]): Promise<type>;
}

export default IStrategy;