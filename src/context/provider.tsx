import * as React from 'react'
import {Bloc} from '../bloc'

interface Props<T extends Bloc> {
  of: { new():T }
  children: React.ReactNode
}

export class Provider<T extends Bloc> extends React.Component<Props<T>, {}> {
  private bloc: T = null
  constructor(props: Props<T>) {
    super(props)
    this.bloc = new this.props.of()
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    if (this.props.of !== nextProps.of) {
      this.bloc = new nextProps.of()
    }
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
