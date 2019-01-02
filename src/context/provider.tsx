import * as React from 'react'
import {ConstructorType, Bloc, contextSymbol, bloc} from '../bloc'
import {FC, RefObject, useContext, useEffect, useRef, useState} from 'react'
import {injectMetadataKey} from '../inject'

export interface ProviderProps<T> {
  of: ConstructorType<T>
  args?: any[]
  use?: T
  blocRef?: RefObject<T>
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

class BlocContainer {
  private _bloc: Bloc = undefined
  public get bloc() {
    return this._bloc
  }
  public set bloc(newBloc: any) {
    if (newBloc === undefined) return
    const oldBloc = this._bloc
    if (newBloc === oldBloc) return
    if (typeof oldBloc === 'object' && oldBloc.blocWillDestroy) {
      oldBloc.blocWillDestroy()
    }
    this._bloc = newBloc
  }
  
  hasBloc() {
    return this._bloc !== undefined
  }
}

export const Provider: FC<Props<any>> = function<T>(props: Props<T>) {
  const containerRef = useRef(
    new BlocContainer()
  )
  const Context = Reflect.getMetadata(contextSymbol, props.of)
  
  function createBloc(Bloc: ConstructorType<T>, args?: any[]) {
    const injects = Reflect.getMetadata(injectMetadataKey, Bloc) || []
    const paramTypes = Reflect.getMetadata('design:paramtypes', Bloc) || []
    for (let inject of injects) {
      const Context = Reflect.getMetadata(contextSymbol, paramTypes[inject])
      args[inject] = useContext(Context)
    }
    return new Bloc(...args)
  }
  
  if (props.use) {
    containerRef.current.bloc = props.use
  } else {
    if (!containerRef.current.hasBloc()) {
      containerRef.current.bloc = createBloc(props.of, props.args)
    }
  }
  
  return (
    <Context.Provider value={containerRef.current.bloc}>
      {props.children}
    </Context.Provider>
  )
}

Provider.defaultProps = {
  args: []
}


export function withProvider<P, T=any>(providerProps: ((props: P) => ProviderProps<T>) | ProviderProps<T>) {
  return function (C: React.ComponentType<P>): React.ComponentType<P> {
    return function(props: P) {
      if (typeof providerProps === 'function') {
        providerProps = providerProps(props)
      }
      return (
        <Provider {...providerProps}>
          <C {...props} />
        </Provider>
      )
    }
  }
}
