// import { Constructor } from "../types/utils";
// import { Registry } from "./Registry";

// interface IInjectableParams {
//   devModeOnly?: boolean;
// }

// export function Injectable(
//   { devModeOnly }: IInjectableParams = { devModeOnly: false }
// ) {
//   return (target: Constructor<any>) => {
//     Registry.getInstance().register(target);
//     Reflect.defineMetadata("devModeOnly", devModeOnly, target);
//   };
// }
