import * as React from 'react'
import {AbstractBloc, Bloc} from '../bloc'
import {RefObject} from 'react'

interface Props<T extends Bloc> {
  of: AbstractBloc<T>
  args?: any[]
  use?: T
  blocRef?: RefObject<T>
}

type ComponentProps<T> = Props<T> & {
  children: React.ReactNode
}

export class Provider<T extends Bloc> extends React.Component<ComponentProps<T>, {}> {
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

  constructor(props: ComponentProps<T>) {
    super(props)
    if (props.use) {
      this.bloc = props.use
    } else {
      this.createBloc(props.of, props.args)
    }
  }

  createBloc(B: AbstractBloc<T>, args?: any[]) {
    if (args) {
      this.bloc = new B(...args)
    } else {
      this.bloc = new B()
    }
  }

  componentWillReceiveProps(nextProps: Props<T>) {
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
    const Context = (of as any as typeof Bloc).getContext()
    return (
      <Context.Provider value={this.bloc}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export function withProvider<T>(providerProps: Props<T>) {
  return function<P> (C: React.ComponentType<P>) {
    return function(props: P) {
      return (
        <Provider {...providerProps}>
          <C {...props} />
        </Provider>
      )
    }
  }
}
