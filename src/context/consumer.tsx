import * as React from 'react'
import {ConstructorType, Bloc, contextSymbol} from '../bloc'
import {ReactNode} from 'react'

interface Props<T extends Bloc> {
  of: ConstructorType<T>
  children: (bloc: T)=>ReactNode
}

export class Consumer<T extends Bloc> extends React.Component<Props<T>, {}> {
  render() {
    const { of } = this.props
    const Context = Reflect.getMetadata(contextSymbol, of)
    return (
      <Context.Consumer>
        {(value: T) => (
          this.props.children(value)
        )}
      </Context.Consumer>
    )
  }
}

export function useBloc<T>(B: ConstructorType<T>): T {
  const Context = Reflect.getMetadata(contextSymbol, B)
  return React.useContext(Context) as T
}
