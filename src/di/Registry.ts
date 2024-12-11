import { Constructor } from "../types/utils";

export interface IDIContainer {
  register<T>(implementation: Constructor<T>): void;
  resolve<T>(implementation: Constructor<T>): T;
}

export class Registry {
  private static instance: Registry;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  private readonly services: Map<string, Constructor<any>> = new Map();

  private constructor() {}

  register<T>(token: string, implementation: Constructor<T>) {
    if (this.services.has(token)) {
      throw new Error(`The ${token} is already registered.`);
    }

    this.services.set(token, implementation);
  }

  resolve<T>(token: string): T {
    const implementation = this.services.get(token);

    if (!implementation) {
      throw new Error(`The ${token} is not registered.`);
    }

    const paramTypes: Constructor<any>[] =
      Reflect.getMetadata("design:paramtypes", implementation) ?? [];

    const dependences = paramTypes.map((_, index) => {
      const dependencyToken = Reflect.getMetadata(
        `inject:${index}`,
        implementation
      );

      return this.resolve(dependencyToken);
    });

    return new implementation(...dependences);
  }

  // resolve<T>(implementation: Constructor<T>): T {
  //   const token = implementation.name;
  //   const impl = this.services.get(token);

  //   if (!impl) {
  //     throw new Error(`The ${token} is not registered.`);
  //   }

  //   const devModeOnly = Reflect.getMetadata("devModeOnly", impl);

  //   if (devModeOnly && process.env.NODE_ENV !== "development") {
  //     throw new Error(
  //       `${token} should not be used outside of development environment.`
  //     );
  //   }

  //   const paramTypes: Constructor<any>[] =
  //     Reflect.getMetadata("design:paramtypes", impl) ?? [];

  //   const dependences = paramTypes.map((constructor) =>
  //     this.resolve(constructor)
  //   );

  //   return new impl(...dependences);
  // }
}
