import * as React from 'react'
import {ConstructorType, Bloc, contextSymbol} from '../bloc'
import {FC, RefObject, useContext, useEffect, useRef, useState} from 'react'

export interface ProviderProps<T> {
  of: ConstructorType<T>
  args?: any[]
  use?: T
  blocRef?: RefObject<T>
}

type Props<T> = ProviderProps<T> & {
  children: React.ReactNode
}

export class Provider<T extends Bloc> extends React.Component<Props<T>, {}> {
  private _bloc: T = null
  private get bloc(): T {
    return this._bloc
  }
  private set bloc(b: T) {
    if (this._bloc && !this.props.use) {
      if (this._bloc.blocWillDestroy) {
        this._bloc.blocWillDestroy()
      }
    }
    this._bloc = b
    if (this.props.blocRef) {
      // @ts-ignore
      this.props.blocRef.current = this.bloc
    }
  }

  constructor(props: Props<T>) {
    super(props)
    if (props.use) {
      this.bloc = props.use
    } else {
      this.createBloc(props.of, props.args)
    }
  }

  createBloc(B: ConstructorType<T>, args?: any[]) {
    if (args) {
      this.bloc = new B(...args)
    } else {
      this.bloc = new B()
    }
  }

  componentWillReceiveProps(nextProps: ProviderProps<T>) {
    if (nextProps.use && this.props.use !== nextProps.use) {
      this.bloc = nextProps.use
    } else {
      if (this.props.of !== nextProps.of) {
        this.createBloc(nextProps.of, nextProps.args)
      }
    }
  }

  componentWillUnmount(): void {
    this.bloc = null
  }

  render() {
    const { of } = this.props
    const Context = Reflect.getMetadata(contextSymbol, of)
    return (
      <Context.Provider value={this.bloc}>
        {this.props.children}
      </Context.Provider>
    )
  }
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

export const ProviderFC: FC<Props<any>> = function<T>(props: Props<T>) {
  const containerRef = useRef(
    new BlocContainer()
  )
  const Context = Reflect.getMetadata(contextSymbol, props.of)
  
  function createBloc(Bloc: ConstructorType<T>, args?: any[]) {
    const injects: any = []
    for (let inject of injects) {
      useContext(inject)
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
  
  useEffect(() => {
  
  },[])
  
  return (
    <Context.Provider value={containerRef.current.bloc}>
      {props.children}
    </Context.Provider>
  )
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
