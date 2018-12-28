import {injector} from './injector'
// import 'reflect-metadata'

export function injectable<T extends {new(...args:any[]):{}}>(constructor: T) {
  // const decorated = class extends constructor {
  //   newProperty = "new property";
  //   hello = "override";
  // }
  // constructor.name
  injector.register(constructor)
}
