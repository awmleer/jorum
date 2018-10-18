import * as React from 'react'

export type AbstractBloc<T extends Bloc> = { new (...args: any[]): T }

export class Bloc {
  static context:React.Context<any> = null
  static getContext<T extends Bloc>(this: {new():T}): React.Context<T> {
    const ctor: typeof Bloc = this as any
    if (ctor.context === null) {
      ctor.context = React.createContext(null)
    }
    return ctor.context
  }
}
