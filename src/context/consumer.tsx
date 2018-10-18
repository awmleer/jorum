import * as React from 'react'
import {Bloc} from '../bloc'
import {ReactNode} from 'react'

interface Props<T extends Bloc> {
  of: { new (): T }
  children: (bloc: T)=>ReactNode
}

export class Consumer<T extends Bloc> extends React.Component<Props<T>, {}> {
  render() {
    const { of } = this.props
    const Context = (of as any as typeof Bloc).getContext()
    return (
      <Context.Consumer>
        {(value: T) => (
          this.props.children(value)
        )}
      </Context.Consumer>
    )
  }
}
