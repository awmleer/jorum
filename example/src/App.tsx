import React from "react"
import {CounterBloc, TestBloc} from './bloc/counter.bloc'
import {Subscribe} from '../../lib'
import {Consumer, Provider} from '../../lib'
import {Counter} from './Counter'

const counterBloc = new CounterBloc(100)

interface State {
  switcher: boolean
}

export class App extends React.Component<{}, State> {
  state = {
    switcher: true
  }

  changeText = () => {
    this.setState(prevState => ({
      switcher: !prevState.switcher
    }))
  }

  render() {
    return (
      <div>
        {this.state.switcher}
        <button onClick={this.changeText}>switch bloc</button>
        {this.state.switcher ? (
          <Provider of={CounterBloc} use={counterBloc}>
            <Counter/>
          </Provider>
        ) : (
          <Provider of={TestBloc}>
            <Consumer of={TestBloc}>
              {testBloc => (
                <Subscribe to={testBloc.a$}>
                  {a => (
                    <p>{a}</p>
                  )}
                </Subscribe>
              )}
            </Consumer>
          </Provider>
        )}
      </div>
    )
  }
}

