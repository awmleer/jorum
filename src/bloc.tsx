import * as React from 'react'

export type ConstructorType<T> = { new (...args: any[]): T }

export interface Bloc {
  blocWillDestroy?(): void
}

export const contextSymbol = Symbol()

export function bloc<T extends {new(...args:any[]):{}}>(constructor: T) {
  Reflect.defineMetadata(contextSymbol, React.createContext(null), constructor)
}
