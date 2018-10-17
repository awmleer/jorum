import * as React from 'react'
import {ReactNode} from 'react'


export class Bloc {
  private static context:React.Context<any> = null
  private static getContext() {
    if (this.context === null) {
      this.context = React.createContext(null)
    }
    return this.context
  }
  static get Provider() {
    const bloc = new this()
    const context = this.getContext()
    return class BlocProvider<T extends Bloc> extends React.Component {
      render() {
        return (
          <context.Provider value={bloc}>
            {this.props.children}
          </context.Provider>
        )
      }
    }
  }
  static get Consumer() {
    const context = this.getContext()
    return class BlocConsumer<T extends Bloc> extends React.Component<{children:(bloc:T)=>ReactNode}, any> {
      render() {
        return (
          <context.Consumer>
            {bloc => (
              this.props.children(bloc)
            )}
          </context.Consumer>
        )
      }
    }
  }
}
