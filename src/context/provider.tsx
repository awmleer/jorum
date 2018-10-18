import * as React from 'react'
import {AbstractBloc, Bloc} from '../bloc'

interface Props<T extends Bloc> {
  of: AbstractBloc<T>
  args?: any[]
  use?: T
  children: React.ReactNode
}

export class Provider<T extends Bloc> extends React.Component<Props<T>, {}> {
  private bloc: T = null
  constructor(props: Props<T>) {
    super(props)
    if (this.props.use) {
      this.bloc = this.props.use
    } else {
      this.createBloc(this.props.of, this.props.args)
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
