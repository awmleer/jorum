import * as React from 'react'
import {ReactNode} from 'react'


export class Bloc {
  static Context = React.createContext(null)
  static get Provider() {
    const bloc = new this()
    const { Context } = this
    return class BlocProvider<T extends Bloc> extends React.Component {
      render() {
        return (
          <Context.Provider value={bloc}>
            {this.props.children}
          </Context.Provider>
        )
      }
    }
  }
  static get Consumer() {
    const { Context } = this
    return class BlocConsumer<T extends Bloc> extends React.Component<{children:(bloc:T)=>ReactNode}, any> {
      render() {
        return (
          <Context.Consumer>
            {bloc => (
              this.props.children(bloc)
            )}
          </Context.Consumer>
        )
      }
    }
  }
}
