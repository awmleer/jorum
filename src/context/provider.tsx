import * as React from 'react'
import {ConstructorType, Bloc, contextSymbol} from '../bloc'
import {FC, useContext, useEffect, useRef} from 'react'
import {injectMetadataKey} from '../inject'
import {Unsubscribable} from 'rxjs'
import {Effect, effectsMetadataKey} from '../effect'

export interface ProviderProps<T> {
  of: ConstructorType<T>
  args?: any[]
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

class BlocContainer {
  public blocType: ConstructorType<Bloc> = null
  
  private _bloc: Bloc = undefined
  public get bloc() {
    return this._bloc
  }
  public set bloc(newBloc: any) {
    if (newBloc === undefined) return
    if (newBloc === this._bloc) return
    this.cleanUp()
    this._bloc = newBloc
    this.initialize()
  }
  
  private effectSubscriptions: Unsubscribable[] = []
  
  initialize() {
    const effects: Effect[] = Reflect.getMetadata(effectsMetadataKey, this.blocType) || []
    for (const effect of effects) {
      const subscription = effect.stream$.subscribe(
        (this._bloc as {[key: string]: (value?: string) => void})[effect.propertyKey].bind(this._bloc)
      )
      this.effectSubscriptions.push(subscription)
    }
  }
  
  cleanUp() {
    if (typeof this._bloc !== 'object') return
    for (const subscription of this.effectSubscriptions) {
      subscription.unsubscribe()
    }
    this.effectSubscriptions = []
    if (this._bloc.blocWillDestroy) {
      this._bloc.blocWillDestroy()
    }
  }
  
  hasBloc() {
    return this._bloc !== undefined
  }
}

export const Provider: FC<Props<any>> = function<T>(props: Props<T>) {
  function createBloc(Bloc: ConstructorType<T>, args?: any[]) {
    const injects = Reflect.getMetadata(injectMetadataKey, Bloc) || []
    const paramTypes = Reflect.getMetadata('design:paramtypes', Bloc) || []
    for (let inject of injects) {
      const Context = Reflect.getMetadata(contextSymbol, paramTypes[inject])
      args[inject] = useContext(Context)
    }
    return new Bloc(...args)
  }
  
  const containerRef = useRef(new BlocContainer())
  
  if (containerRef.current.blocType !== props.of) {
    containerRef.current.blocType = props.of
    containerRef.current.bloc = createBloc(props.of, props.args)
  }
  
  if (!containerRef.current.hasBloc()) {
    containerRef.current.bloc = createBloc(props.of, props.args)
  }
  
  useEffect(() => {
    return () => {
      containerRef.current.bloc = null
    }
  }, [])
  
  const Context = Reflect.getMetadata(contextSymbol, props.of)
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
