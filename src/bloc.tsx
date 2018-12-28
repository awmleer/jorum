import * as React from 'react'

export type AbstractBloc<T extends Bloc> = { new (...args: any[]): T }

export interface Bloc {
  // static context:React.Context<any> = null
  // static getContext<T extends Bloc>(this: {new():T}): React.Context<T> {
  //   const ctor: typeof Bloc = this as any
  //   if (ctor.context === null) {
  //     ctor.context = React.createContext(null)
  //   }
  //   return ctor.context
  // }
  blocWillDestroy?(): void
}

export const contextSymbol = Symbol()

export function bloc<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}
