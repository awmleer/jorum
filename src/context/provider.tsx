import * as React from 'react'
import {Bloc} from '../bloc'

interface Props<T extends Bloc> {
  of: { new():T }
  children: React.ReactNode
}



export class Provider<T extends Bloc> extends React.Component<Props<T>, any> {
  bloc: T
  constructor(props: Props<T>) {
    super(props)
    // this.checkContext(this.props.of)
    this.bloc = new this.props.of()
  }

  // checkContext(C: typeof Bloc) {
  //   if (C.context === null) {
  //     C.context = React.createContext(null)
  //   }
  // }

  render() {
    const { of } = this.props
    const ctor: typeof Bloc = of as any
    const Context = ctor.getContext()
    return (
      <Context.Provider value={this.bloc}>
        {this.props.children}
      </Context.Provider>
    )
  }
}



// export function Provider<T extends Bloc>(bloc: T): React.Context<T> {
//
// }
