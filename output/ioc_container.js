// Filename: ioc_container.js

class IoCContainer {
  constructor() {
    this.dependencies = {};
  }

  register(dependencyName, constructorFn) {
    this.dependencies[dependencyName] = constructorFn;
  }

  resolve(dependencyName) {
    if (!this.dependencies.hasOwnProperty(dependencyName)) {
      try {
        // Try to dynamically load and register the dependency
        const Module = require(`./${dependencyName}`);
        this.register(dependencyName, () => new Module());
      } catch (error) {
        throw new Error(`Unregistered dependency: ${dependencyName}`);
      }
    }

    return this.dependencies[dependencyName]();
  }
}

module.exports = new IoCContainer();
